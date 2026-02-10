<script setup lang="ts">
import { MessageType } from '@/types/chat';
import avatar01 from '@/assets/imgs/avatar/01.jpg';
import { useChatStore } from '@/stores/chat';

interface Props {
  type: MessageType;
  url?: string;
}

const chatStore = useChatStore();
const props = withDefaults(defineProps<Props>(), {
  url: avatar01,
});
</script>

<template>
  <div
    class="chat-avatar"
    :class="{
      staff: props.type === MessageType.EMPLOYEE,
      tansfer: props.type === MessageType.TRANSFER,
      robot: props.type === MessageType.CHATBOT,
    }"
  >
    <img
      :src="chatStore.userAvatar || props.url"
      v-if="props.type === MessageType.USER"
    />

    <svg-icon
      icon="chat-robot"
      class="robot"
      v-if="props.type === MessageType.CHATBOT"
    />

    <svg-icon
      icon="chat-staff"
      class="staff"
      v-if="props.type === MessageType.EMPLOYEE"
    />
    <svg-icon
      icon="chat-staff"
      class="staff"
      v-if="props.type === MessageType.TRANSFER"
    />
  </div>
</template>

<style lang="scss" scoped>
.staff {
  svg {
    width: 25px;
    height: 25px;
  }
}

.robot {
  svg {
    width: 25px;
    height: 25px;
  }
}

.chat-avatar {
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  &.robot {
    background-color: var(--chat-robot-color);
  }
  &.tansfer {
    background-color: var(--chat-transfer-color);
  }
  &.staff {
    background-color: var(--chat-staff-color);
  }
  img {
    width: 100%;
    height: 100%;
    border-radius: 4px;
  }
}
</style>
