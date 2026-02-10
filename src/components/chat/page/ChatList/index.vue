<script setup lang="ts">
import ChatListCard from '@/components/chat/page/ChatListCard/index.vue';
import { ChatCardProps } from '@/types/chat';
import { useChatStore } from '@/stores/chat';
import { getEmitter } from '@/utils/chat/methods';
import { EVENT_CHAT_SELECT } from '@/constants/chat/event';

interface Props {
  data: ChatCardProps[];
}

const props = defineProps<Props>();
const chatStore = useChatStore();
const emitter = getEmitter();

const handleClick = (item: ChatCardProps) => {
  chatStore.setCurrentChatId(item.sessionId);
  emitter.emit(EVENT_CHAT_SELECT, item.sessionId);
};
</script>

<template>
  <div class="chat-list">
    <div
      class="chat-card"
      v-for="(item, index) in props.data"
      :key="index"
      :class="{ active: chatStore.currentChatId == item.sessionId }"
    >
      <chat-list-card v-bind="item" @click="handleClick(item)" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat {
  &-card {
    border-bottom: 1px solid #f2f2f2;
    border-left: 2px solid transparent;
    &.active {
      background-color: #faf7fb;
      border-left: 2px solid var(--primary-purple);
    }
    &:first-child {
      border-top: 1px solid #f2f2f2;
    }
  }
}
</style>
