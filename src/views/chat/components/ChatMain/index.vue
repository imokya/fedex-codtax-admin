<script lang="ts" setup>
import { ref, watch, onBeforeUnmount, onMounted, onUnmounted } from 'vue';
import dayjs from 'dayjs';
import ChatHeader from '@/components/chat/page/ChatHeader/index.vue';
import ChatInput from '@/components/chat/page/ChatInput/index.vue';
import ChatRoom from '@/components/chat/page/ChatRoom/index.vue';
import { wait } from '@/utils/methods';

import {
  EVENT_MESSAGE,
  EVENT_CHAT_INIT,
  EVENT_CHAT_OVER,
  EVENT_USER_MESSAGE,
  EVENT_MESSAGE_RESEND,
  EVENT_IMAGE_LOAD,
  MSG_DISCONNECT,
  EVENT_REFESH_LIST
} from '@/constants/chat/event';

import { MediaType } from '@/types/chat';

import { getEmitter } from '@/utils/chat/methods';
import { insertSystemTime } from '@/utils/chat/message';
import { useChatStore } from '@/stores/chat';
import { useChatSettingStore } from '@/stores/chat/setting';
import { useMessageStore } from '@/stores/chat/message';

import { v4 as uuid } from 'uuid';

import { Message, MessageType } from '@/types/chat';
import useChatSocket from '@/hooks/chat/useChatSocket';
import ChatService from '@/services/chat/chat.service';
import useAutoPulling from '@/hooks/chat/useAutoPulling';
import { showCountDownAlert } from '@/utils/methods';

const chatRoomRef = ref();
const showLoading = ref(false);
const settingStore = useChatSettingStore();
const messageStore = useMessageStore();
const chatStore = useChatStore();
const emitter = getEmitter();
const currentPage = ref(1);
const totalPage = ref(1);
const pageSize = ref(20);

// 客户端聊天计时
// useAutoShutChat();

// 客户端socket
const { sendMessageToUser, sendMessageRead } = useChatSocket();

// 轮询
const { start: startPulling, stop: stopPulling } = useAutoPulling();
startPulling();

onBeforeUnmount(() => {
  stopPulling();
});

watch(
  () => chatStore.currentChatId,
  () => {
    if (chatStore.currentChatId !== '') {
      initChat();
    }
  },
  { flush: 'post' }
);

watch(
  () => chatStore.isChatListEmpty,
  () => {
    if (chatStore.isChatListEmpty) {
      clearChat();
    }
  },
  {
    flush: 'post',
  }
);

const initChat = async () => {
  currentPage.value = 1;
  await initMessageList();
  emitter.emit(EVENT_CHAT_INIT);
  sendMessageRead();
};

const clearChat = () => {
  chatStore.clearChat();
  messageStore.clearMessageList();
};

const getMessageList = async () => {
  const { data: result } = await ChatService.getChatHistory({
    sessionId: chatStore.currentUser?.sessionId,
    // scopeId: chatStore.currentScopeId,
    page: currentPage.value,
    size: pageSize.value,
    platform: 0,
  });

  // 过滤发送失败的消息
  if (!chatStore.isChatEnalbed) {
    result.chatMessageDataList = result.chatMessageDataList.filter(
      (item: Message) => item.sendResult === 0
    );
  }

  totalPage.value = result.pageTotal;
  result.chatMessageDataList = result.chatMessageDataList.map((item: any) => {
    return {
      type: item.sender,
      receiverType: item.receiver,
      message: item.content,
      mediaType: item.messageType,
      time: +dayjs(item.sendTime),
      status: item.sendResult === 0 ? 'success' : 'fail',
      seq: item?.seq,
    } as Message;
  });

  return result.chatMessageDataList;
};

const initMessageList = async () => {
  const messageList = await getMessageList();
  const formatMessageList = insertSystemTime(messageList);
  if (chatStore.isCurrentUserUntag) {
    formatMessageList.push({
      type: MessageType.TYPE_SELECT,
    });
  }
  messageStore.setMessageList(formatMessageList);
  chatRoomRef.value.scrollIntoView(false);
};

/**
 * 全局事件
 */
emitter.on(EVENT_MESSAGE, (message: string) => {
  setTimeout(() => {
    const seq = uuid();
    const msg: Message = {
      type: MessageType.EMPLOYEE,
      message,
      mediaType: MediaType.TEXT,
      time: dayjs().valueOf(),
      seq,
    };
    insertMessage(msg);
    sendMessageToUser(message, seq);
  }, 100);
});

emitter.on(EVENT_IMAGE_LOAD, () => {
  console.log('event image load');
  chatRoomRef.value?.scrollIntoView();
});

emitter.on(EVENT_USER_MESSAGE, (data: any) => {
  // console.log('EVENT_USER_MESSAGE', data);
  // 是当前选中的会话才发送消息
  const mediaType =
    data.msgType === 'PICTURE' ? MediaType.IMAGE : MediaType.TEXT;
  if (chatStore.currentChatId === data.sessionId) {
    const msg: Message = {
      type: data.source,
      message: data.content,
      mediaType,
      time: +dayjs(data.sendTime),
    };
    insertMessage(msg);
    sendMessageRead();
  }
});

emitter.on(EVENT_MESSAGE_RESEND, (data: any) => {
  console.log('EVENT_MESSAGE_RESEND', data.seq);
  sendMessageToUser(data.message, data.seq, 1);
});

emitter.on(EVENT_CHAT_OVER, (data: any) => {
  // 根据状态判断是否要发送
  if (chatStore.currentChatId !== data.sessionId) return;
  console.log('TYPE_SELECT', messageStore.hasTypeSelect());
  if (!messageStore.hasTypeSelect()) {
    const msg: Message = {
      type: MessageType.TYPE_SELECT,
    };
    messageStore.setMessageList([...messageStore.messageList, msg]);
    chatRoomRef.value?.scrollIntoView();
  }
});

emitter.on(MSG_DISCONNECT, (reason: string) => {
  if (reason !== 'io client disconnect') {
    showCountDownAlert({
      title: '连接已经断开',
      description: '刷新页面重新连接',
      duration: 5,
      onConfirm: () => {
        window.location.reload();
      },
    });
  }
});


/**
 * 方法
 */
const insertMessage = (msg: Message) => {
  const messageList = messageStore.messageList;
  const lastMessage = messageList[messageList.length - 1];
  const newMessage = insertSystemTime([msg], dayjs(lastMessage?.time));
  messageStore.setMessageList([...messageList, ...newMessage]);
  chatRoomRef.value?.scrollIntoView();
};

// insertMessage({
//   type: MessageType.TRANSFER,
//   name: '机器人',
//   message: '【留言信息】这个客户希望看到更多的消息',
//   mediaType: 'text',
//   time: dayjs().valueOf(),
//   seq: uuid(),
// });

const handleLoadMore = async () => {
  if (currentPage.value >= totalPage.value) return;
  showLoading.value = true;
  await wait();
  currentPage.value += 1;
  const messageList = await getMessageList();
  const moreData = insertSystemTime(messageList);
  messageStore.setMessageList([...moreData, ...messageStore.messageList]);

  showLoading.value = false;
  chatRoomRef.value.scrollTo();
};

// onMounted(() => {
//   emitter.emit(EVENT_CHAT_TRANSFER);
// });

onUnmounted(() => {
  clearChat();
});
</script>

<template>
  <div class="chat-main">
    <chat-header :disabled="!chatStore.isChatHistoryEnabled" />
    <div class="chat-converstion">
      <chat-room :data="messageStore.messageList" ref="chatRoomRef" @loadmore="handleLoadMore"
        :enable-scroll-bottom="true" :enable-load-more="true" :loading="showLoading" class="chat-room" />
    </div>
    <div class="chat-input-wrap">
      <chat-input :disabled="!chatStore.isChatEnalbed" />
    </div>
  </div>
</template>

<style lang="scss" scope>
.chat-room {
  height: calc(100vh - var(--chat-header-height) - var(--chat-input-height) - 1px);
}

.chat-converstion {
  flex: 1;
  overflow: hidden;
}

.chat-input-wrap {
  height: var(--chat-input-height);
  border-top: 1px solid var(--frame-border-color);
  margin-top: auto;
  box-sizing: border-box;
}

.chat-main {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
