<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import Popup from '@/components/base/Popup/index.vue';
import CommonButton from '@/components/base/CommonButton/index.vue';
import TransformCard from './TranformCard.vue';
import Empty from '@/components/base/Empty/index.vue';
import { API_Status } from '@/constants/api';
import {
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  getEmitter,
} from '@/utils/methods';

import { EVENT_REFESH_LIST } from '@/constants/chat/event';

import TransferService from '@/services/chat/transfer.service';
import ChannelService from '@/services/admin/channel.service';

import { ChannelData } from '@/types/admin';
import { TransferData } from '@/types/chat';
import { useChatStore } from '@/stores/chat';

const emits = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm', data: TransferData): void;
}>();

const currentData = ref<TransferData>();
const channelList = ref<ChannelData[]>([]);
const channelValue = ref('IXP');
const currentIndex = ref(-1);
const serviceList = ref<TransferData[]>([]);
const disabled = ref(false);
const contentRef = ref();

const loading = ref(true);
const chatStore = useChatStore();
const emitter = getEmitter();

const getList = async () => {
  try {
    const { data: result } = await TransferService.getList({
      channelName: channelValue.value,
    });
    const list = result.list.map((item: any) => {
      return {
        employeeId: item.employeeId,
        status: item.employeeLoginStatus,
      };
    });
    serviceList.value = list;
  } finally {
    loading.value = false;
  }
};

const canTransfer = computed(() => {
  return currentIndex.value !== -1 && !disabled.value;
});

const handleClick = (item: TransferData, index: number) => {
  currentData.value = item;
  currentIndex.value = index;
};

const handleTransfer = async () => {
  if (currentIndex.value !== -1) {
    doTransfer();
  }
};

const doTransfer = async () => {
  const loading = showLoading('转接中...', contentRef.value);
  try {
    const { message: msg, status } = await TransferService.transfer({
      targetEmployeeId: currentData.value!.employeeId,
    });
    if (status == API_Status.SUCCESS) {
      chatStore.removeCurrentUser();
      chatStore.selectNextUser();
      emitter.emit(EVENT_REFESH_LIST);
      disabled.value = true;
      emits('confirm', currentData.value!);
    } else {
      showError(msg || '转接失败');
    }
  } finally {
    hideLoading(loading);
    disabled.value = false;
  }
};

const getChannelList = async () => {
  const { data: result } = await ChannelService.getList();
  channelList.value = result?.channels;
};

const handleChannelChange = () => {
  getList();
};

onMounted(() => {
  getList();
  getChannelList();
});
</script>

<template>
  <popup @close="emits('close')" class="!min-h-[500px]">
    <template #header>
      <div class="chat-transform-header">转接对话</div>
    </template>

    <div class="chat-transform-content" ref="contentRef">
      <!-- <div class="chat-transform-search">
            <el-input
              :clearable="true"
              @input="handleInput"
              v-model="keyword"
              placeholder="搜索客服"
              :suffix-icon="Search"
              style="height: 100%"
            />
          </div> -->
      <div class="chat-transform-channel">
        <div class="chat-transform-channel-label text-[14px] mb-1">渠道</div>
        <el-select v-model="channelValue" @change="handleChannelChange">
          <el-option v-for="item in channelList" :key="item.name" :label="item.name" :value="item.name" />
        </el-select>
      </div>
      <div class="chat-transform-list">
        <!-- <div class="chat-transform-list-header">
          在线客服列表
          （{{ rawData.length }}）
        </div> -->
        <el-scrollbar class="scrollbar">
          <div class="chat-transform-list-wrap">
            <div class="chat-transform-list-item" v-for="(item, index) in serviceList" :key="index"
              v-if="serviceList.length > 0">
              <transform-card :data="item" :active="index === currentIndex" @click="handleClick(item, index)" />
            </div>
            <empty v-if="serviceList.length === 0 && !loading" class="mt-12" content="暂无可转接客服" />
          </div>
        </el-scrollbar>
      </div>
    </div>
    <div class="chat-transform-footer">
      <common-button class="button-cancel" @click="emits('close')" :disabled="disabled" type="blue"
        link>取消</common-button>
      <common-button class="button-confirm" type="primary" @click="handleTransfer"
        :disabled="!canTransfer">转接</common-button>
    </div>
  </popup>
</template>

<style lang="scss" scoped>
.button-cancel {
  font-size: 14px;
  font-weight: 600;
}

.button-confirm {
  font-size: 18px;
  font-weight: 600;
}

.scrollbar {
  height: 300px;
  overflow: hidden;
}

:deep(.el-input__wrapper) {
  box-shadow: none;
  background-color: transparent;
}

.chat-transform {
  &-list {
    padding: 15px 20px 15px 0;

    &-item {
      border-bottom: 1px solid #e3e3e3;
      padding-left: 10px;
      padding-bottom: 2px;
      overflow: hidden;
    }

    &-wrap {
      margin-top: 15px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    &-header {
      font-size: 14x;
      color: var(--secondary-purple);
      font-weight: 600;
      padding-bottom: 10px;
    }
  }

  &-header {
    font-size: 20px;
    color: var(--text-color);
    flex-shrink: 0;
  }

  &-footer {
    height: 44px;
    flex-shrink: 0;
    display: flex;
    gap: 5px;
    justify-content: flex-end;
  }

  &-search {
    background-color: #f8f8f8;
    border-radius: 12px;
    height: 37px;
    flex-shrink: 0;
  }

  &-list {
    flex: 1;
  }

  &-content {
    flex: 1;
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}
</style>
