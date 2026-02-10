<script setup lang="ts">
import { onUnmounted } from 'vue';
import ChatSidebar from './components/ChatSidebar/index.vue';
import ChatMain from './components/ChatMain/index.vue';
import ChatReply from './components/ChatReply/index.vue';
import { getEmitter } from '@/utils/chat/methods';

import SocketClient from '@/socket';

const emitter = getEmitter();

// 清除所有事件
onUnmounted(() => {
  emitter.all.clear();
  SocketClient.destroy();
});
</script>

<template>
  <div class="chat">
    <div class="chat-left">
      <chat-sidebar />
    </div>
    <div class="chat-main">
      <chat-main />
    </div>
    <div class="chat-right">
      <chat-reply />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat {
  display: flex;
  height: 100%;
  min-width: 1280px;
  border: 1px solid #000;

  &-left {
    width: 350px;
    border-right: 1px solid var(--frame-border-color);
  }
  &-main {
    flex: 1;
  }
  &-right {
    width: 350px;
    border-left: 1px solid var(--frame-border-color);
  }
}
</style>
