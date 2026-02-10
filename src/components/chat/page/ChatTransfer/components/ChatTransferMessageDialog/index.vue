<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Popup from '@/components/base/Popup/index.vue';
import CommonButton from '@/components/base/CommonButton/index.vue';
import TransferService from '@/services/chat/transfer.service';

import { getEmitter } from '@/utils/methods';
import { EVENT_REFESH_LIST } from '@/constants/chat/event';
import { API_Status } from '@/constants/api';
import { useChatStore } from '@/stores/chat';
import { MAX_REPLY_LENGTH } from '@/constants/chat';

import {
  showLoading,
  hideLoading,
  showSuccess,
  showError,
} from '@/utils/methods';

interface Props {
  targetEmployeeId: string;
}

const emits = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm'): void;
  (e: 'update:modelValue'): void;
}>();

const props = withDefaults(defineProps<Props>(), {
  targetEmployeeId: '',
});

const message = ref('');
const emitter = getEmitter();
const chatStore = useChatStore();
const disabled = ref(false);

const contentRef = ref();

const doTransfer = async () => {
  const loading = showLoading('转接中...', contentRef.value);
  try {
    const { message: msg, status } = await TransferService.transfer({
      targetEmployeeId: props.targetEmployeeId,
      transferMessage: message.value,
    });
    if (status == API_Status.SUCCESS) {
      showSuccess('转接成功');
      chatStore.removeCurrentUser();
      chatStore.selectNextUser();
      emitter.emit(EVENT_REFESH_LIST);
      disabled.value = true;
      emits('confirm');
    } else {
      showError(msg || '转接失败');
    }
  } finally {
    hideLoading(loading);
  }
};

const handleConfirm = () => {
  doTransfer();
};
const canSend = computed(() => {
  return true;
  //return message.value.trim() !== '';
});
</script>

<template>
  <popup @close="emits('close')">
    <template #header>
      <div class="chat-transfer-dialog-header">转接对话</div>
    </template>
    <div class="chat-transfer-dialog" ref="contentRef">
      <div class="chat-transfer-dialog-add-content">
        <el-input
          resize="none"
          type="textarea"
          v-model="message"
          input-style="height:150px;padding: 15px;"
          placeholder="请输入转接留言"
          :maxlength="MAX_REPLY_LENGTH"
        />
      </div>
      <div class="chat-transfer-dialog-footer">
        <common-button
          type="primary"
          class="button-confirm"
          @click="handleConfirm"
          :disabled="!canSend"
          >转接</common-button
        >
      </div>
    </div>
  </popup>
</template>

<style lang="scss" scoped>
.chat-transfer-dialog {
  &-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 30px;
  }

  &-header {
    font-size: 20px;
    color: var(--text-color);
    margin-bottom: 20px;
  }
}
</style>
