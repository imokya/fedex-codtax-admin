<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import type { Message } from '@/types/chat';
import type { ChatHistoryParams } from '@/services/chat/chat.service';
import SearchIcon from '@/components/icons/Search.vue';
import CalendarIcon from '@/components/icons/Calendar.vue';
import { insertSystemTime } from '@/utils/chat/message';
import ChatRoom from '../ChatRoom/index.vue';
import Popup from '@/components/base/Popup/index.vue';
import CommonButton from '@/components/base/CommonButton/index.vue';
import Empty from '@/components/base/Empty/index.vue';
import { useChatStore } from '@/stores/chat';
import { MessageType } from '@/types/chat';
import { hightLightKeywords } from '@/utils/methods';
import { wait } from '@/utils/methods';

import dayjs from 'dayjs';
import ChatService from '@/services/chat/chat.service';
import { disabledChatDate } from '@/utils/admin/methods';

const emits = defineEmits(['close']);

const page = ref(1);
const size = ref(10);
const totalPage = ref(1);
const messageList = ref<Message[]>([]);
const chatRoomRef = ref();
const keywrod = ref('');
const time = ref('');
const chatStore = useChatStore();
const showLoading = ref(false);
let startTime: number | undefined;
let endTime: number | undefined;

const getMessageList = async (all: boolean = true) => {
  if (time.value) {
    startTime = +dayjs(time.value[0]);
    endTime = +dayjs(time.value[1]);
  }

  const params: ChatHistoryParams = {
    //keyWord: keywrod.value,
    size: size.value,
    page: page.value,
    startTime,
    endTime,
    platform: 0,
  };

  if (all) {
    params.userId = chatStore.currentUser?.userId;
  } else {
    params.sessionId = chatStore.currentUser?.sessionId;
  }

  const { data: result } = await ChatService.getChatHistory(params);

  // 过滤发送失败的消息
  result.chatMessageDataList = result.chatMessageDataList.filter(
    (item: Message) => item.sendResult === 0
  );

  totalPage.value = result.pageTotal;

  result.chatMessageDataList = result.chatMessageDataList.map((item: any) => {
    return {
      type: item.sender,
      receiverType: item.receiver,
      message: item.content,
      mediaType: item.messageType,
      time: +dayjs(item.sendTime),
    } as Message;
  });

  if (keywrod.value.trim() !== '') {
    const found = result.chatMessageDataList.some((item: any) =>
      item.message.includes(keywrod.value)
    );
    if (found) {
      result.chatMessageDataList = result.chatMessageDataList.map(
        (item: any) => {
          if (item.type === MessageType.SYSTEM) {
            return item;
          }
          return {
            ...item,
            message: hightLightKeywords(item.message, keywrod.value),
          };
        }
      );
      chatRoomRef.value?.scrollToHightKeyword();
    } else {
      result.chatMessageDataList = [];
    }
  }
  return result.chatMessageDataList;
};

const handleReset = () => {
  time.value = '';
  keywrod.value = '';
};

const handleLoadMore = async () => {
  if (page.value >= totalPage.value) return;
  showLoading.value = true;
  await wait();
  page.value += 1;
  const _messageList = await getMessageList();
  const moreData = insertSystemTime(_messageList);
  messageList.value = [...moreData, ...messageList.value];

  showLoading.value = false;
  chatRoomRef.value?.scrollTo();
};

const initMessageList = async () => {
  const _messageList = await getMessageList();
  const formatMessageList = insertSystemTime(_messageList);
  messageList.value = formatMessageList;
  await nextTick();
  chatRoomRef.value?.scrollIntoView(false);
};

const handleApply = () => {
  if (keywrod.value) {
    size.value = 999;
  } else {
    size.value = 10;
  }
  page.value = 1;
  initMessageList();
};

const handleClearDate = () => {
  time.value = '';
  startTime = undefined;
  endTime = undefined;
};

const handleKeywordClear = () => {
  keywrod.value = '';
};

onMounted(() => {
  initMessageList();
});
</script>

<template>
  <popup class="!px-0 !h-[600px] w-[90%] sm:w-[80%] md:w-[80%] lg:w-[80%] xl:w-[50%]" @close="emits('close')">
    <template #header>
      <div class="chat-history-panel-header-title px-5">消息历史记录</div>
    </template>
    <div class="chat-history-panel-header">
      <div class="chat-history-filter mt-2">
        <div class="chat-history-filter-fields">
          <div class="chat-history-search">
            <el-input v-model="keywrod" placeholder="搜索关键字" clearable @clear="handleKeywordClear">
              <template #suffix>
                <div @click="handleApply" class="chat-history-search-button">
                  <svg-icon icon="search" />
                </div>
              </template>
            </el-input>
          </div>
          <div class="chat-history-time">
            <el-date-picker v-model="time" type="datetimerange" start-placeholder="开始日期" end-placeholder="截止日期"
              format="YYYY-MM-DD HH:mm:ss" :default-time="[+dayjs().startOf('date'), +dayjs().endOf('date')]"
              :prefix-icon="CalendarIcon" @clear="handleClearDate" :disabled-date="disabledChatDate" />
          </div>
        </div>
        <div class="chat-history-filter-actions">
          <!-- <common-button
            type="blue"
            link
            class="button-cancel h-[40px]"
            @click="handleReset"
            >全部清除</common-button
          > -->
          <common-button type="primary" class="button-confirm h-[40px]" @click="handleApply">应用</common-button>
        </div>
      </div>
    </div>
    <div class="chat-history-main">
      <div class="chat-history-chat-room">
        <chat-room :data="messageList" ref="chatRoomRef" :enable-load-more="true" :enable-scroll-bottom="true"
          :loading="showLoading" :show-name="true" @loadmore="handleLoadMore" class="chat-room-history h-[400px]"
          style="width: 100%" v-show="messageList.length > 0" />
        <empty v-show="messageList.length === 0" class="mt-32" content="暂无内容" />
      </div>
    </div>
  </popup>
</template>

<style lang="scss" scoped>
.button-cancel {
  font-weight: 600;
  font-size: 14px;
}

.button-confirm {
  font-weight: 600;
  font-size: 18px;
  padding: 5px 20px;
}

:deep(.el-input__wrapper) {
  --el-input-border-radius: 50px;
  --el-input-inner-height: 45px;
  --el-input-height: 45px;
  padding-left: 15px;
  padding-right: 15px;

  .el-input__icon {
    width: 18px;
    height: 18px;
  }
}

:deep(.el-input__suffix) {
  // border-left: 1px solid currentColor;
  padding: 0 10px;
}

.chat-history {
  &-time {
    :deep(.el-input__wrapper) {
      --el-input-border-radius: 0;
    }
  }

  &-filter {
    display: flex;
    flex-direction: column;
    gap: 15px;

    &-actions {
      display: flex;
      margin-left: auto;
    }

    &-fields {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 20px;
    }
  }

  &-search {
    margin: 10px 0;
    flex-shrink: 0;
    flex: 1;

    &-button {
      cursor: pointer;
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }

  &-chat-room {
    flex: 1;
    height: 400px;
  }

  &-main {
    width: 100%;
    display: flex;
    gap: 10px;
    background-color: #fafafa;
    padding: 10px;
  }

  &-panel {
    background-color: #fff;

    &-header {
      width: 100%;
      padding: 0 20px 20px 20px;
      margin-top: -20px;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        bottom: 0;
        left: 0;
        box-shadow: 0px 4px 15px 0px rgba(0, 0, 0, 0.05);
        pointer-events: none;
      }

      &-title {
        color: var(--text-color);
        font-size: 20px;
        display: flex;
        justify-content: space-between;

        svg {
          width: 16px;
          height: 16px;
        }
      }
    }
  }
}
</style>
