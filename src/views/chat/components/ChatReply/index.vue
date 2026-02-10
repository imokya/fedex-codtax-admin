<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { v4 as uuid } from 'uuid';

import { InstantReply } from '@/types/chat';
import InstantReplyFolder from '@/components/chat/page/InstantReplyFolder/index.vue';
import InstantReplyCard from '@/components/chat/page/InstantReplyCard/index.vue';
import InstantReplyDialog from '@/components/chat/page/InstantReplyDialog/index.vue';
import InstantReplyFolderDialog from '@/components/chat/page/InstantReplyFolderDialog/index.vue';
import Loading from '@/components/base/Loading/index.vue';
import { useInstantReplyStore } from '@/stores/chat/instantReply';
import { useChatStore } from '@/stores/chat';
import Sortable from 'sortablejs';

import Empty from '@/components/base/Empty/index.vue';
import {
  showConfirm,
  getEmitter,
  showSuccess,
  showError,
} from '@/utils/methods';
import { EVENT_INPUT_MESSAGE } from '@/constants/chat/event';
import ReplyService from '@/services/chat/reply.service';
import { API_Status } from '@/constants/api';

const emitter = getEmitter();
const currentMessageId = ref('');
const replyStore = useInstantReplyStore();
const chatStore = useChatStore();
const showLoading = ref(true);

const getReplyData = async () => {
  try {
    const { data: result } = await ReplyService.getCategory();
    replyStore.setData(result.categories);
    const { data: publicResult } = await ReplyService.getCategory('PUBLIC');
    replyStore.setPublicData(publicResult.categories);
  } finally {
    showLoading.value = false;
  }
};

/**
 * 快捷回复逻辑处理
 */

const removeLocalReply = (id: string, folderId: string) => {
  const filterData = replyStore.data.map((item: any) => {
    if (item.id === folderId) {
      if (item.children) {
        item.children = item.children.filter((child: any) => child.id !== id);
      }
    }
    return item;
  });
  replyStore.setData(filterData);
};

const editLocalReply = (message: string) => {
  const data = replyStore.data.map((item: any) => {
    if (item.children) {
      item.children = item.children.map((child: any) => {
        if (child.id === replyStore.messageId) {
          return {
            ...child,
            text: message,
          };
        }
        return child;
      });
    }
    return item;
  });
  replyStore.setData(data);
};

const addLocalReply = (id: string, message: string) => {
  const data = replyStore.data.map((item: any) => {
    if (item.id === replyStore.folderId) {
      if (item.children) {
        item.children = [{ id, text: message }, ...item.children];
      }
    }
    return item;
  });
  replyStore.setData(data);
};

const handleRemoveReply = async (data: any, folderId: string) => {
  const { status, message: msg } = await ReplyService.removeReply(data.id);
  if (status == API_Status.SUCCESS) {
    // removeLocalReply(data.id, folderId);
    getReplyData();
    showSuccess('删除成功');
  } else {
    showError(msg || '删除失败');
  }
};

const handleSaveReply = async (message: string) => {
  if (replyStore.mode === 'edit') {
    const { status, message: msg } = await ReplyService.modifyReply(
      replyStore.messageId,
      message
    );
    if (status == API_Status.SUCCESS) {
      // editLocalReply(message);
      getReplyData();
      showSuccess('修改成功');
    } else {
      showError(msg || '修改失败');
    }
  } else if (replyStore.mode === 'add') {
    const {
      status,
      message: msg,
      data: result,
    } = await ReplyService.createReply(replyStore.folderId, message);
    if (status == API_Status.SUCCESS) {
      // addLocalReply(result.id, message);
      getReplyData();
      showSuccess('创建成功');
    } else {
      showError(msg || '创建失败');
    }
  }
};

const handleSendReply = (data: any) => {
  const message = data.text;
  emitter.emit(EVENT_INPUT_MESSAGE, message);
  // if (chatStore.isChatEnalbed) {
  //   const message = data.text;
  //   emitter.emit(EVENT_INPUT_MESSAGE, message);
  // } else {
  //   showError('未选择聊天对象');
  // }
};

/**
 * 文件夹处理逻辑
 */

const editLocalFolder = (name: string) => {
  const data = replyStore.data.map((item: any) => {
    if (item.id === replyStore.folderId) {
      return {
        ...item,
        text: name,
      };
    }
    return item;
  });
  replyStore.setData(data);
};

const addLocalFolder = (id: string, name: string) => {
  const data = [{ id, text: name, children: [] }, ...replyStore.data] as any[];
  replyStore.setData(data);
};

const removeLocalFolder = (id: string) => {
  const filterData = replyStore.data.filter((item: any) => item.id !== id);
  replyStore.setData(filterData);
};

const handleSaveFolder = async (name: string) => {
  if (replyStore.mode === 'edit') {
    const { status, message: msg } = await ReplyService.modifyCategory(
      replyStore.folderId,
      name
    );
    if (status == API_Status.SUCCESS) {
      // editLocalFolder(name);
      getReplyData();
      showSuccess('修改文件夹成功');
    } else {
      showError(msg || '修改文件夹失败');
    }
  } else if (replyStore.mode === 'add') {
    const {
      status,
      data: result,
      message: msg,
    } = await ReplyService.createCategory(name);
    if (status == API_Status.SUCCESS) {
      // addLocalFolder(result.id, name);
      getReplyData();
      showSuccess('文件夹创建成功');
    } else {
      showError(msg || '创建失败');
    }
  }
};

const handleRemoveFolder = (data: InstantReply) => {
  const removeFolder = async () => {
    const { status, message: msg } = await ReplyService.removeCategory(data.id);
    if (status == API_Status.SUCCESS) {
      // removeLocalFolder(data.id);
      getReplyData();
      showSuccess('删除成功');
    } else {
      showError(msg || '删除失败');
    }
  };
  if (data.children!.length > 0) {
    showConfirm({
      title: '删除文件夹',
      description:
        '文件夹一旦删除，包含的所有快捷回复也将全部删除<br/>确认删除文件夹吗？',
      onConfirm: async () => {
        removeFolder();
      },
    });
  } else {
    removeFolder();
  }
};

const reorderFolders = () => {
  const folders = replyListRef.value.querySelectorAll('.reply-list-folder');
  const categoryIds: string[] = [];
  folders.forEach((folder: any) => {
    const id = folder.getAttribute('data-id');
    categoryIds.push(id);
  });
  ReplyService.reorderCategory(categoryIds);
};

const replyListRef = ref();
const initSortable = () => {
  if (replyListRef.value) {
    Sortable.create(replyListRef.value, {
      draggable: '.reply-list-folder',
      onEnd: (event) => {
        reorderFolders();
      },
    });
  }
};

const init = async () => {
  await getReplyData();
  initSortable();
};

onMounted(() => {
  init();
});
</script>

<template>
  <div class="reply relative">
    <div class="reply-header">
      <div class="reply-header-text">快捷回复</div>
      <div
        title="新建文件夹"
        class="reply-header-button"
        @click="replyStore.openFolderDialog(null, 'add')"
      >
        <svg-icon icon="chat-add" />
      </div>
    </div>
    <el-scrollbar class="scrollbar">
      <div
        class="reply-list"
        @click.stop
        @mouseleave="currentMessageId = ''"
        ref="replyListRef"
      >
        <div
          class="reply-list-public"
          v-for="item in replyStore.publicData"
          :key="item.id"
        >
          <instant-reply-folder
            :data="item"
            :editable="false"
            :sortable="false"
            :is-public="true"
          >
            <div
              class="reply-list-item"
              v-for="card in item.children"
              :key="card.id"
            >
              <instant-reply-card
                :text="card.text"
                :id="card.id"
                :sortable="false"
                :editable="false"
                :active="currentMessageId === card.id"
                @send="handleSendReply(card)"
                @active="currentMessageId = card.id"
                @deactive="currentMessageId = ''"
              />
            </div>
          </instant-reply-folder>
        </div>
        <div
          class="reply-list-folder"
          v-for="item in replyStore.data"
          :data-id="item.id"
          :key="item.id"
        >
          <instant-reply-folder
            :data="item"
            :id="item.id"
            @remove="handleRemoveFolder($event)"
            @edit="replyStore.openFolderDialog($event, 'edit')"
            @add="replyStore.openMessageDialog(item, 'add')"
          >
            <div
              class="reply-list-item"
              v-for="card in item.children"
              :key="card.id"
              :data-id="card.id"
            >
              <instant-reply-card
                :text="card.text"
                :id="card.id"
                :active="currentMessageId === card.id"
                @active="currentMessageId = card.id"
                @deactive="currentMessageId = ''"
                @send="handleSendReply(card)"
                @remove="handleRemoveReply(card, item.id)"
                @edit="replyStore.openMessageDialog(card, 'edit')"
              />
            </div>
          </instant-reply-folder>
        </div>
      </div>
    </el-scrollbar>
    <loading class="absolute left-0 right-0 top-[200px]" :show="showLoading" />
    <empty
      v-if="
        replyStore.data.length === 0 &&
        !showLoading &&
        replyStore.publicData.length === 0
      "
      :content="'暂无快捷回复'"
      class="absolute left-0 right-0 top-[200px]"
    >
      <!-- <div class="add-button" @click="replyStore.openFolderDialog(null, 'add')">
        <svg-icon icon="chat-add" />添加
      </div> -->
    </empty>
  </div>
  <instant-reply-dialog
    v-if="replyStore.replyMessageDialogVisible"
    v-model="replyStore.message"
    :mode="replyStore.mode"
    @close="replyStore.showReplyMessageDialog(false)"
    @save="handleSaveReply"
  />
  <instant-reply-folder-dialog
    v-model="replyStore.folderName"
    v-if="replyStore.replyFolderDialogVisible"
    :mode="replyStore.mode"
    @close="replyStore.showReplyFolderDialog(false)"
    @save="handleSaveFolder"
  />
</template>

<style lang="scss" scoped>
.add-button {
  font-size: 16px;
  color: #595959;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  border-radius: 20px;
  border: 1px solid #bfbfbf;
  width: 90px;
  padding: 2px 0;
  margin: 0 auto;
  margin-top: 15px;
  cursor: pointer;
  user-select: none;
}
.reply {
  height: 100%;
  display: flex;
  flex-direction: column;
  &-list {
    display: flex;
    flex-direction: column;
    padding: 20px;
    &-item {
      margin: 5px 0;
    }
  }
  &-header {
    height: var(--chat-header-height);
    border-bottom: 1px solid var(--frame-border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    flex-shrink: 0;
    user-select: none;

    &-button {
      cursor: pointer;
      svg {
        width: 18px;
        height: 18px;
      }
    }

    &-text {
      font-size: 16px;
      color: #333333;
    }
  }
}

.scrollbar {
  height: calc(100vh - var(--chat-header-height));
}
</style>
