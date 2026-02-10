<script setup lang="ts">
import { computed, ref } from 'vue';
import ReplyCard from './ReplyCard.vue';
import InstantReplyDialog from '@/components/chat/page/InstantReplyDialog/index.vue';
import ReplyService from '@/services/chat/reply.service';
import { useReplyStore } from '@/stores/admin/reply';
import { API_Status } from '@/constants/api';
import { showSuccess, showError } from '@/utils/methods';
import type { InstantReply } from '@/types/chat';
import Empty from '@/components/base/Empty/index.vue';

const replyStore = useReplyStore();
const currentFolderId = computed(() => replyStore.currentFolderId);
const currentFolderData = computed(() => replyStore.currentFolderData);
const currentFolderName = computed(() => replyStore.currentFolderName);
const currentMessageId = ref('');

const emits = defineEmits<{
  (e: 'refresh'): void;
}>();

const handleRemoveReply = async (data: any, folderId: string) => {
  const { status, message: msg } = await ReplyService.removeReply(data.id);
  if (status == API_Status.SUCCESS) {
    emits('refresh');
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
      emits('refresh');
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
      emits('refresh');
      showSuccess('创建成功');
    } else {
      showError(msg || '创建失败');
    }
  }
};

const handleAddReply = () => {
  const item = {
    id: currentFolderId.value,
    text: '',
    children: [],
  } as InstantReply;
  replyStore.openMessageDialog(item, 'add');
};
</script>

<template>
  <div class="reply-list">
    <div class="reply-list-header">
      <div class="min-w-[300px]">{{ currentFolderName }}</div>
      <div
        class="reply-list-button"
        :class="{ disabled: !currentFolderName }"
        @click.stop="handleAddReply"
      >
        <svg-icon icon="chat-add" />
      </div>
    </div>
    <div class="reply-list-content">
      <el-scrollbar
        class="scrollbar"
        v-if="currentFolderData && currentFolderData!.length > 0"
      >
        <div
          class="reply-list-content-item"
          v-for="item in currentFolderData"
          :key="item.id"
        >
          <reply-card
            :text="item.text"
            :id="item.id"
            :active="currentMessageId === item.id"
            @active="currentMessageId = item.id"
            @deactive="currentMessageId = ''"
            @remove="handleRemoveReply(item, item.id)"
            @edit="replyStore.openMessageDialog(item, 'edit')"
          />
        </div>
      </el-scrollbar>
    </div>
  </div>
  <instant-reply-dialog
    v-if="replyStore.replyMessageDialogVisible"
    v-model="replyStore.message"
    :mode="replyStore.mode"
    @close="replyStore.showReplyMessageDialog(false)"
    @save="handleSaveReply"
  />
</template>

<style lang="scss" scoped>
.reply-list {
  display: flex;
  flex-direction: column;
  height: 100%;

  &-button {
    &.disabled {
      cursor: not-allowed;
      pointer-events: none;
      opacity: 0.3;
    }
    cursor: pointer;
    svg {
      width: 16px;
      height: 16px;
    }
  }

  &-header {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f2f2f2;
    padding: 0 15px;
    box-sizing: border-box;
    color: var(--primary-purple);
    font-weight: 600;
  }
  &-content {
    border-right: 1px solid #f2f2f2;
    padding: 10px 15px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;

    &-item {
      margin-bottom: 10px;
    }
  }
}
</style>
