<script setup lang="ts">
import { computed, ref } from 'vue';
import ChatHistory from '@/components/chat/page/ChatHistory/index.vue';
import CommonButton from '@/components/base/CommonButton/index.vue';
import { useChatStore } from '@/stores/chat';

interface Props {
  disabled: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const chatStore = useChatStore();
const showChatHistory = ref(false);

const userName = computed(() => {
  // if (chatStore.isChatListEmpty) {
  //   return '';
  // }
  if (chatStore.currentUser) {
    return chatStore.currentUser.userName;
  } else {
    return '';
  }
});
</script>

<template>
  <div class="chat-main-header">
    <div class="chat-main-header-name">
      {{ userName }}
    </div>
    <div class="chat-main-header-history">
      <common-button
        round
        type="blue"
        class="button-more"
        :disabled="props.disabled"
        @click="showChatHistory = true"
      >
        更多历史消息
        <template #suffix>
          <svg-icon icon="chat-arrow-right" />
        </template>
      </common-button>
    </div>
  </div>
  <chat-history v-if="showChatHistory" @close="showChatHistory = false" />
</template>

<style lang="scss" scoped>
.button-more {
  font-weight: 600;
  font-size: 14px;
  border-width: 2px;
  padding-left: 20px;
  padding-right: 20px;
}
.chat-main {
  &-header {
    height: var(--chat-header-height);
    border-bottom: 1px solid var(--frame-border-color);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;

    &.disabled {
      .chat-main-header-history {
        opacity: 0.5;
        pointer-events: none;
      }
    }

    &-name {
      color: var(--primary-purple);
      font-weight: 600;
      font-size: 16px;
    }

    &-history {
      user-select: none;
      font-size: 14px;
      color: var(--primary-purple);
      display: flex;
      align-items: center;
      gap: 5px;
      svg {
        width: 16px;
        height: 16px;
      }
    }
  }
}
</style>
