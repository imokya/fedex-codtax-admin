<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';

import { CHAT_ID } from '@/constants/chat';
import { useChatStore } from '@/stores/chat';
import { ChatCardProps, UserStatus } from '@/types/chat';
import { ChatListTabProps } from '@/components/chat/page/ChatListTab/index.vue';

import Empty from '@/components/base/Empty/index.vue';
import ChatList from '@/components/chat/page/ChatList/index.vue';
import ChatListTabs from '@/components/chat/page/ChatListTab/index.vue';
import { EVENT_REFESH_LIST, MSG_CONNECT } from '@/constants/chat/event';
import { getEmitter, wait } from '@/utils/methods';

import ChatService from '@/services/chat/chat.service';

const emitter = getEmitter();
const currentIndex = ref(0);
const chatStore = useChatStore();

const getListData = async () => {
  try {
    const { data: result } = await ChatService.getChatList();
    chatStore.setChatList(result.sessionCardList);
    chatStore.setNumInQueue(result.pipelineWaitCount);
    chatStore.selectDefaultChat();
  } catch {}
};

emitter.on(EVENT_REFESH_LIST, () => {
  getListData();
  console.log('refresh chat list');
});

emitter.on(MSG_CONNECT, async () => {
  await wait(500);
  await getListData();
  await nextTick();
  chatStore.selectFirstUser();
});

const selectFirstInList = (index: number = 0) => {
  if (index === 0) {
    // 判断之前是否在列表中选择过
    const chatId = sessionStorage.getItem(CHAT_ID);
    if (chatId) {
      chatStore.setCurrentChatId(chatId);
    } else {
      const data = chatListData.value;
      if (data.length > 0) {
        chatStore.setCurrentChatId(data[0].sessionId);
      }
    }
  } else {
    sessionStorage.setItem(CHAT_ID, chatStore.currentChatId as string);
    const data = chatListDoneData.value;
    if (data.length > 0) {
      chatStore.setCurrentChatId(data[0].sessionId);
    }
  }
};

const handleTabChange = (data: any) => {
  currentIndex.value = data.index;
  selectFirstInList(data.index);
};

const chatListData = computed(() => {
  const data = chatStore.chatList.filter((item: ChatCardProps) => {
    return item.sessionStatus !== UserStatus.END;
  });
  return data;
});

const chatListDoneData = computed(() => {
  return chatStore.chatList.filter((item: ChatCardProps) => {
    return item.sessionStatus === UserStatus.END;
  });
});

const chatListTotal = computed(() => {
  return chatListData.value.length;
});

const chatListDoneTotal = computed(() => {
  return chatListDoneData.value.length;
});

const tabData = ref<ChatListTabProps[]>([
  {
    text: '我的对话',
    total: chatListTotal,
  },
  {
    text: '已完成',
    total: chatListDoneTotal,
  },
]);
</script>

<template>
  <div class="sidebar-main">
    <chat-list-tabs @change="handleTabChange" :data="tabData" />
    <div class="chat-list" v-if="currentIndex === 0">
      <el-scrollbar class="scrollbar" v-if="chatListData.length > 0">
        <chat-list :data="chatListData" />
      </el-scrollbar>
      <empty
        content="暂无对话"
        v-if="chatListData.length === 0"
        style="margin-top: 100px"
      />
    </div>
    <div class="chat-list" v-if="currentIndex === 1">
      <el-scrollbar class="scrollbar" v-if="chatListDoneData.length > 0">
        <chat-list :data="chatListDoneData" />
      </el-scrollbar>
      <empty
        v-if="chatListDoneData.length === 0"
        style="margin-top: 100px"
        content="暂无对话"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-main {
  overflow: hidden;
}

.scrollbar {
  height: calc(
    100vh - var(--chat-footer-height) - var(--chat-header-height) -
      var(--sidebar-tab-height)
  );
}
</style>
