<script setup lang="ts">
import type { InstantReply } from '@/types/chat';
import ReplyFolderCard from './ReplyFolderCard.vue';
import InstantReplyFolderDialog from '@/components/chat/page/InstantReplyFolderDialog/index.vue';
import { showSuccess, showError, showConfirm } from '@/utils/methods';
import Empty from '@/components/base/Empty/index.vue';

import ReplyService from '@/services/chat/reply.service';
import { API_Status } from '@/constants/api';

import { useReplyStore } from '@/stores/admin/reply';

const emits = defineEmits<{
  (e: 'refresh'): void;
}>();

const replyStore = useReplyStore();

const handleSaveFolder = async (name: string) => {
  if (replyStore.mode === 'edit') {
    const { status, message: msg } = await ReplyService.modifyCategory(
      replyStore.folderId,
      name
    );
    if (status == API_Status.SUCCESS) {
      emits('refresh');
      showSuccess('修改文件夹成功');
    } else {
      showError(msg || '修改文件夹失败');
    }
  } else if (replyStore.mode === 'add') {
    const {
      status,
      data: result,
      message: msg,
    } = await ReplyService.createCategory(name, 'PUBLIC');
    if (status == API_Status.SUCCESS) {
      emits('refresh');
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
      emits('refresh');
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
</script>

<template>
  <div class="reply-folder">
    <div class="reply-folder-header">
      公共回复文件夹
      <div
        class="reply-folder-button"
        @click="replyStore.openFolderDialog(null, 'add')"
      >
        <svg-icon icon="chat-add" />
      </div>
    </div>
    <div class="reply-folder-content">
      <el-scrollbar class="scrollbar" v-if="replyStore.data.length > 0">
        <div class="folder-list" @click.stop ref="folderListRef">
          <div
            class="folder-list-item"
            v-for="item in replyStore.data"
            :key="item.id"
          >
            <reply-folder-card
              :data="item"
              @remove="handleRemoveFolder($event)"
              @edit="replyStore.openFolderDialog($event, 'edit')"
              @add="replyStore.openMessageDialog(item, 'add')"
            />
          </div>
        </div>
      </el-scrollbar>
      <empty
        v-if="replyStore.data.length === 0"
        class="mt-[100px]"
        content="暂无内容<br>点击右上方+号添加"
      />
    </div>
  </div>
  <instant-reply-folder-dialog
    v-model="replyStore.folderName"
    v-if="replyStore.replyFolderDialogVisible"
    :mode="replyStore.mode"
    @close="replyStore.showReplyFolderDialog(false)"
    @save="handleSaveFolder"
  />
</template>

<style lang="scss" scoped>
.reply-folder {
  display: flex;
  flex-direction: column;
  height: 100%;

  &-button {
    cursor: pointer;
    svg {
      width: 16px;
      height: 16px;
    }
  }

  &-content {
    border-right: 1px solid #f2f2f2;
    padding: 10px 15px;
    flex: 1;
  }
  &-header {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f2f2f2;
    flex-shrink: 0;
    padding: 0 15px;
  }
}
</style>
