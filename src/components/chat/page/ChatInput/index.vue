<script setup lang="ts">
import { computed, watch, ref, watchEffect } from 'vue';
import CommonButton from '@/components/base/CommonButton/index.vue';
import ChatTransfer from '@/components/chat/page/ChatTransfer/index.vue';
import { showConfirm, getEmitter } from '@/utils/methods';
import {
  EVENT_MESSAGE,
  EVENT_CHAT_OVER,
  EVENT_INPUT_MESSAGE,
  EVENT_REFESH_LIST,
} from '@/constants/chat/event';
import ChatService from '@/services/chat/chat.service';
import { MAX_REPLY_LENGTH } from '@/constants/chat';
import { useMagicKeys } from '@vueuse/core';

interface Props {
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const message = ref('');
const emitter = getEmitter();
const showTransfer = ref(false);
const inputRef = ref<any>()
const { alt, ctrl, enter } = useMagicKeys()

const canSend = computed(() => {
  return message.value.trim() !== '' && !props.disabled;
});

emitter.on(EVENT_INPUT_MESSAGE, (msg: string) => {
  // if (!props.disabled) {
  message.value = msg;
  // }
});

watch(
  () => props.disabled,
  () => {
    if (props.disabled) {
      message.value = '';
    }
  }
);

const handleEndChat = () => {
  showConfirm({
    title: '结束对话',
    description: '请确认已解决客户的所有问题再结束对话',
    onConfirm: async () => {
      try {
        await ChatService.endChat();
        emitter.emit(EVENT_CHAT_OVER);
        emitter.emit(EVENT_REFESH_LIST);
      } catch { }
    },
  });
};

const submit = () => {
  if (message.value.trim() !== '') {
    emitter.emit(EVENT_MESSAGE, message.value);
    message.value = '';
  }
};

const handleSend = () => {
  submit();
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.code === 'Enter') {
    e.preventDefault();
  }

};

watchEffect(() => {
  if (!inputRef.value) return
  const sPos = inputRef.value.textarea.selectionStart ?? 0
  const ePos = inputRef.value.textarea.selectionEnd ?? sPos
  const text = message.value
  if (alt?.value && enter?.value) {
    message.value = text.slice(0, sPos) + '\n' + text.slice(ePos)
  } else if (ctrl?.value && enter?.value) {
    message.value = text.slice(0, sPos) + '\n' + text.slice(ePos)
  } else {
    if (enter?.value) {
      if (!props.disabled) {
        submit();
      }
    }
  }
})
</script>

<template>
  <div class="chat-input">
    <div class="chat-input-bar">
      <div class="chat-input-bar-text">消息</div>
      <div class="chat-input-action">
        <div class="chat-input-action__transform" :class="{ disabled: props.disabled }" @click="showTransfer = true">
          <svg-icon icon="chat-transform" />转接
        </div>
        <div class="chat-input-action__close" @click="handleEndChat" :class="{ disabled: props.disabled }">
          <svg-icon icon="chat-shut" />结束
        </div>
      </div>
    </div>
    <div class="chat-input-message">
      <el-input placeholder="输入内容" :autofocus="true" v-model="message" type="textarea" resize="none"
        input-style="border:none;box-shadow:none;height:100px;width:100%;padding:15px;font-size:16px;border-radius:0;overflow:hidden;"
        :maxlength="MAX_REPLY_LENGTH" @keydown="handleKeyDown" ref="inputRef" />
      <common-button type="primary" class="send-button" @click="handleSend" :disabled="!canSend">发送</common-button>
    </div>
  </div>
  <chat-transfer v-model="showTransfer" />
</template>

<style lang="scss" scoped>
.send-button {
  font-size: 18px;
  position: absolute;
  font-weight: 600;
  right: 20px;
  bottom: 30px;
  padding-left: 35px;
  padding-right: 35px;
  letter-spacing: 1px;
}

.chat-input {
  &-message {
    height: calc(var(--chat-input-height) - 41px);
    position: relative;

    &.disabled {
      pointer-events: none;
    }
  }

  &-action {
    display: flex;
    align-items: center;
    gap: 20px;
    font-size: 14px;
    color: #565656;

    &__close {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;

      &.disabled {
        opacity: 0.5;
        pointer-events: none;
      }

      svg {
        width: 16px;
        height: 16px;
      }
    }

    &__transform {
      display: flex;
      align-items: center;
      cursor: pointer;
      gap: 5px;

      &.disabled {
        opacity: 0.5;
        pointer-events: none;
      }

      svg {
        width: 16px;
        height: 16px;
      }
    }
  }

  &-bar {
    height: 40px;
    background-color: #fafafa;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;

    &-text {
      font-size: 16px;
      color: #595959;
    }
  }
}
</style>
