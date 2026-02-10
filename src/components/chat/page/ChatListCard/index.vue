<script setup lang="ts">
import { ChatCardProps, UserStatus } from '@/types/chat';
import { formatChatTime } from '@/utils/chat/message';
import dayjs from 'dayjs';

const props = defineProps<ChatCardProps>();
</script>

<template>
  <div
    class="chat-list-card"
    :class="{
      done: props.sessionStatus === UserStatus.END,
      untag: props.sessionStatus === UserStatus.TYPE_REQUIRED,
      normal: props.sessionStatus === UserStatus.STARTED,
    }"
  >
    <div class="chat-list-card-avatar"><img :src="props.avatar" /></div>
    <div class="chat-list-card-left">
      <div class="chat-list-card-name">{{ props.userName }}</div>
      <div class="chat-list-card-message">{{ props.lastMsgContent }}</div>
    </div>
    <div class="chat-list-card-right">
      <div class="chat-list-card-time">
        {{ formatChatTime(props.lastMsgTime, true) }}
        <!-- {{ dayjs(props.lastMsgTime).format('HH:mm') }} -->
      </div>
      <div class="chat-list-card-extra">
        <div
          class="chat-list-card-total"
          v-if="
            props.sessionStatus === UserStatus.STARTED && props.unreadCount > 0
          "
        >
          <span :class="{ center: props.unreadCount > 99 }">{{
            props.unreadCount <= 99 ? props.unreadCount : '...'
          }}</span>
        </div>
        <div
          class="chat-list-card-unselect"
          v-if="props.sessionStatus === UserStatus.TYPE_REQUIRED"
        >
          <span>待选择</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins.scss';

.chat-list-card {
  height: 75px;
  padding: 0 15px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  position: relative;

  &.untag {
    // background-color: #fafafa;
  }

  // &.done {
  //   opacity: 0.6;
  //   pointer-events: none;
  // }

  &:hover {
    background-color: #faf7fb;
  }

  &-unselect {
    color: #fff;
    font-size: 10px;
    background-color: #f7b118;
    padding: 2px 10px;
    border-radius: 10px;
  }

  &-total {
    font-size: 10px;
    position: relative;

    & > span {
      width: 16px;
      height: 16px;
      display: inline-block;
      background-color: #de002e;
      color: #fff;
      border-radius: 50%;
      text-align: center;
      line-height: 16px;
      &.center {
        line-height: 10px;
      }
    }
  }

  &-name {
    max-width: 200px;
    font-size: 16px;
    color: #333333;
    @include mixins.ellipsis;
  }

  &-message {
    max-width: 200px;
    font-size: 14px;
    color: #8e8e8e;
    @include mixins.ellipsis;
  }

  &-time {
    font-size: 12px;
    color: #8e8e8e;
    position: absolute;
    right: 15px;
    top: 15px;
  }

  &-extra {
    margin-top: auto;
  }

  &-left {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 12px 0;
  }

  &-right {
    height: 100%;
    margin-left: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;

    padding: 12px 0;
  }

  &-avatar {
    width: 50px;
    height: 50px;
    flex-shrink: 0;
    img {
      width: 100%;
      height: 100%;
      border-radius: 4px;
    }
  }
}
</style>
