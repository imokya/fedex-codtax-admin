<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import ChatAvatar from '../ChatAvatar/index.vue';
import { Message, MessageType, MediaType } from '@/types/chat';
import { EVENT_MESSAGE_RESEND, EVENT_IMAGE_LOAD } from '@/constants/chat/event';
import { useChatStore } from '@/stores/chat';
import { getEmitter } from '@/utils/methods';
import dayjs from 'dayjs';

interface Props {
  showName?: boolean;
}

const props = withDefaults(defineProps<Message & Props>(), {
  type: MessageType.CHATBOT,
  message: '',
  showName: false,
  status: 'success',
  mediaType: MediaType.TEXT,
});

const emitter = getEmitter();
const chatStore = useChatStore();

const avatar = computed(() => {
  const user = chatStore.currentUser;
  return user?.avatar;
});

const handleResend = () => {
  if (!props.seq) return;
  emitter.emit(EVENT_MESSAGE_RESEND, {
    seq: props.seq,
    message: props.message,
  });
};

const isTransferMessage = computed(() => {
  return (
    props.type === MessageType.EMPLOYEE &&
    props.receiverType === MessageType.EMPLOYEE
  );
});

const isRobotMessage = computed(() => {
  return (
    props.type === MessageType.CHATBOT &&
    props.receiverType !== MessageType.EMPLOYEE
  );
});

const isStaffMessage = computed(() => {
  return (
    props.type === MessageType.EMPLOYEE &&
    props.receiverType !== MessageType.EMPLOYEE
  );
});
</script>

<template>
  <div class="chat-message message" :class="{
    staff: isStaffMessage,
    transfer: isTransferMessage,
    robot: isRobotMessage,
    user:
      props.type === MessageType.USER || props.type === MessageType.PIPELINE,
  }">
    <div class="chat-message-time" v-if="props?.time">
      {{ dayjs(props?.time).format('YYYY-MM-DD HH:mm:ss') }}
    </div>
    <chat-avatar :type="props.type" class="avatar" :url="avatar" />
    <div class="chat-message-content-wrap">
      <div class="chat-message-title" v-if="
        props.name && (props.type === MessageType.TRANSFER || props.showName)
      ">
        {{ props.name }}
      </div>
      <div class="chat-message-content">
        <!-- <span v-if="isTransferMessage">【留言信息】</span
        > -->
        <div v-html="props.message.replace(/\r?\n|\r/g, '<br>')" v-if="
          props.mediaType === MediaType.TEXT ||
          props.mediaType === MediaType.UNKNOWN
        "></div>
        <a :href="props.message" target="_blank"><img :src="props.message" v-if="props.mediaType === MediaType.IMAGE"
            @load="
              () => {
                emitter.emit(EVENT_IMAGE_LOAD);
              }
            " /></a>
        <div class="chat-message-resend" v-if="props.status === 'fail'" title="重新发送" @click="handleResend"
          :class="{ disabled: !chatStore.isChatEnalbed }">
          <svg-icon icon="chat-resend" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.avatar {
  order: 1;
  flex-shrink: 0;
}

.chat-message {
  display: flex;
  align-items: start;
  max-width: 75%;
  gap: 15px;
  margin-right: auto;
  margin-left: 0;
  position: relative;
  margin-top: 30px;

  &-time {
    position: absolute;
    left: 0;
    top: -20px;
    font-size: 12px;
    color: #8c8c8c;
    white-space: nowrap;
  }

  &-resend {
    position: absolute;
    top: 5px;
    right: -35px;
    z-index: 1;
    cursor: pointer;

    &.disabled {
      pointer-events: none;
      filter: grayscale(100%);
      opacity: 0.3;
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }

  &-title {
    font-size: 10px;
    color: #8e8e8e;
    font-weight: 600;
    margin-bottom: 2px;
    text-align: left;
    margin-right: 5px;
    display: none;
  }

  &-content {
    border: 1px solid #e3e3e3;
    padding: 8px 15px;
    font-size: 16px;
    color: #333333;
    background-color: #fff;
    position: relative;
    word-break: break-all;
    flex-shrink: 0;
    display: inline-block;
    flex: 1;
    position: relative;

    img {
      max-width: 200px;
    }

    &-wrap {
      width: 100%;
      order: 2;
    }

    &::after {
      // content: '';
      // width: 8px;
      // height: 8px;
      // position: absolute;

      // background-color: #fff;
      // border: 1px solid #e6e6e6;
      // border-right: 0;
      // border-top: 0;
      // border-radius: 1px;
      // transform: rotate(45deg);
      // z-index: 0;
      // top: 15px;
      // left: -4px;
    }
  }

  &.transfer {
    margin-left: auto;
    margin-right: 0;
    background-color: #fff6f0;

    padding: 10px;

    .avatar {
      order: 2;
    }

    .chat-message-resend {
      left: -35px;
      right: auto;
    }

    .chat-message-title {
      text-align: right;
    }

    .chat-message-content-wrap {
      order: 1;
    }

    .chat-message-content {
      border: 0;
      background-color: var(--chat-transfer-message-color);

      &::after {
        right: -4px;
        left: auto;
        border: 0;
        background-color: var(--chat-transfer-message-color);
      }
    }
  }

  &.robot {
    margin-left: auto;
    margin-right: 0;

    .chat-message-time {
      right: 0;
      left: auto;
    }

    .avatar {
      order: 2;
    }

    .chat-message-resend {
      left: -35px;
      right: auto;
    }

    .chat-message-title {
      text-align: right;
    }

    .chat-message-content-wrap {
      order: 1;
    }

    .chat-message-content {
      border: 0;
      background-color: var(--chat-robot-message-color);

      &::after {
        right: -4px;
        left: auto;
        border: 0;
        background-color: var(--chat-robot-message-color);
      }
    }
  }

  &.staff {
    margin-left: auto;
    margin-right: 0;

    .chat-message-time {
      right: 0;
      left: auto;
    }

    .avatar {
      order: 2;
    }

    .chat-message-resend {
      left: -35px;
      right: auto;
    }

    .chat-message-title {
      text-align: right;
    }

    .chat-message-content-wrap {
      order: 1;
    }

    .chat-message-content {
      border: 0;
      background-color: var(--chat-staff-message-color);

      &::after {
        right: -4px;
        left: auto;
        border: 0;
        background-color: var(--chat-staff-message-color);
      }
    }
  }
}
</style>
