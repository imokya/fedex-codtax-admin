<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';

import ChatTransferListDialog from './components/ChatTransferListDialog/index.vue';
import ChatTransferMessageDialog from './components/ChatTransferMessageDialog/index.vue';
import ChatTransformConfirm from './components/ChatTransformConfirm.vue';
import ChatTransferWaitButton from './components/ChatTransferWaitButton.vue';
import { StaffStatus, TransferData } from '@/types/chat';
import { getEmitter, showAlert, showSuccess, showError } from '@/utils/methods';
import { EVENT_CHAT_TRANSFER_REQUEST } from '@/constants/chat/event';
import { useTransferStore } from '@/stores/chat/transfer';
import { PickupStatus } from '@/constants/chat';
import { TransferRequest } from '@/types/chat';

import TransferService from '@/services/chat/transfer.service';
import { useUserStore } from '@/stores/admin/user';

const userStore = useUserStore();

interface Props {
  modelValue: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
});

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

// const showMessageDialog = ref(false);
// const targetEmployeeId = ref('');
// const transformData = ref<TransferData>();

const emitter = getEmitter();
const transferStore = useTransferStore();
const showPickupConfirm = ref(false);

watch(
  () => transferStore.pickupStatus,
  (status: PickupStatus) => {
    if (status === PickupStatus.DECLINED) {
      handlePicupReject();
    }
  }
);

onMounted(() => {
  transferStore.initPickup();
});

// 收到转接消息
emitter.on(EVENT_CHAT_TRANSFER_REQUEST, (data: TransferRequest) => {
  transferStore.setTransferRequestData(data);
  transferStore.waitToPickup();
  transferStore.checkPicupTime();
  showPickupConfirm.value = true;
});

const handlePicupReject = () => {
  TransferService.reject({
    scopeId: transferStore.transferRequestData.scopeId,
    sessionId: transferStore.transferRequestData.sessionId,
    userId: transferStore.transferRequestData.userId,
    sourceEmployeeId: transferStore.transferRequestData.employeeId,
    targetEmployeeId: userStore.userInfo.id as string,
  });
  showError('已拒绝转接请求');
  showPickupConfirm.value = false;
};

const handlePickupConfirm = async () => {
  transferStore.acceptToPickup();
  TransferService.accept({
    scopeId: transferStore.transferRequestData.scopeId,
    sessionId: transferStore.transferRequestData.sessionId,
    userId: transferStore.transferRequestData.userId,
    sourceEmployeeId: transferStore.transferRequestData.employeeId,
    targetEmployeeId: userStore.userInfo.id as string,
  });
  showSuccess('已接受转接请求');
  showPickupConfirm.value = false;
};

const handlePickupCancel = () => {
  transferStore.declineToPickup();
  showPickupConfirm.value = false;
};

const handlePickupClose = () => {
  transferStore.collpasePickup(true);
  showPickupConfirm.value = false;
};

const showPickupDock = computed(() => {
  return (
    transferStore.pickupCollapsed &&
    transferStore.pickupStatus === PickupStatus.WAITING
  );
});

// const handleNext = (data: TransferData) => {
//   transformData.value = data;
//   targetEmployeeId.value = data.employeeId;
//   emits('update:modelValue', false);
//   showMessageDialog.value = true;
// };

const handleClose = () => {
  emits('update:modelValue', false);
};

const handleWaitButton = () => {
  transferStore.collpasePickup(false);
  showPickupConfirm.value = true;
};

const handleTransferConfirm = (data: TransferData) => {
  if (data.status === StaffStatus.BUSY) {
    showAlert({
      title: '等待忙碌中的客服接受',
    });
  } else {
    // showSuccess('转接成功');
  }
  emits('update:modelValue', false);
};
</script>

<template>
  <div class="chat-transfer">
    <chat-transfer-list-dialog
      v-if="props.modelValue"
      @close="handleClose"
      @confirm="handleTransferConfirm"
    />
    <!-- <chat-transfer-message-dialog
      :target-employee-id="targetEmployeeId"
      v-if="showMessageDialog"
      @confirm="handleTransferConfirm"
      @close="showMessageDialog = false"
    /> -->
    <chat-transfer-wait-button
      v-if="showPickupDock"
      @click="handleWaitButton"
    />
    <chat-transform-confirm
      v-if="showPickupConfirm"
      title="被转接提醒"
      :description="transferStore.confirmText"
      cancel-text="拒绝"
      confirm-text="接受"
      @confirm="handlePickupConfirm"
      @cancel="handlePickupCancel"
      @close="handlePickupClose"
    />
  </div>
</template>
