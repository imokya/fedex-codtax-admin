<script setup lang="ts">
import { nextTick, ref, onMounted } from 'vue';
import UserMessage from './components/UserMessage.vue';
import SystemMessage from './components/SystemMessage.vue';
import type { MessageProps } from '@/types/chat';
import SocketClient from '@/socket';
import dayjs from 'dayjs';
import { EVENT_MSG } from '@/constants/event';
import { SocketParams } from '@/types/socket';

const message = ref<string>('');
const dialog = ref<MessageProps[]>([]);

const dialogRef = ref<HTMLElement>(null);
const lastChatTime = ref<number>(0);

const socket = SocketClient.getInstance().socket;

onMounted(() => {
  initSocket();
});

const initSocket = () => {
  socket.on('connect', () => {
    console.log('client connect', socket.id);
  });
  socket.on(EVENT_MSG, (data: SocketParams) => {
    console.log('client data', data);
    receiveMassge(data);
  });
};

const receiveMassge = (data: SocketParams) => {
  checkTime();
  dialog.value.push({
    type: 'user',
    message: data.msg,
    userType: data.from === socket.id ? 'staff' : 'customer',
  });
  message.value = '';
  nextTick(() => {
    scrollIntoView();
  });
};

const sendMessage = () => {
  if (message.value.trim() !== '') {
    const params: SocketParams = {
      from: socket.id,
      msg: message.value,
    };
    socket.emit(EVENT_MSG, params);
  }
  console.log('socket id', socket.id);
};

const submit = () => {
  sendMessage();
};

// 查看对话的时间间隔
const checkTime = () => {
  if (lastChatTime.value === 0) {
    const formatTime = dayjs().format('HH:mm');
    dialog.value.push({
      type: 'time',
      message: formatTime,
    });
    lastChatTime.value = +new Date();
  } else {
    const diff = dayjs().diff(dayjs(lastChatTime.value), 'minute');
    const formatTime = dayjs().format('HH:mm');
    if (diff >= 1) {
      dialog.value.push({
        type: 'time',
        message: formatTime,
      });
      lastChatTime.value = +new Date();
    }
  }
};

const handleSend = () => {
  submit();
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.code === 'Enter') {
    submit();
  }
};

const scrollIntoView = () => {
  const dialogElem = dialogRef.value;
  const itemElem = dialogElem.querySelectorAll('.message');
  const lastElem = itemElem[itemElem.length - 1];
  lastElem.scrollIntoView({
    behavior: 'smooth',
  });
};
</script>

<template>
  <div class="chat">
    <div class="chat-dialog" ref="dialogRef">
      <template v-for="(item, index) in dialog" :key="index">
        <user-message
          :message="item.message"
          :user-type="item.userType"
          :type="item.type"
          v-if="item.type === 'user'"
        />
        <system-message
          :message="item.message"
          :type="item.type"
          v-if="item.type === 'time' || item.type === 'system'"
        />
      </template>
    </div>
    <div class="action-bar flex">
      <el-input
        type="text"
        clearable
        v-model="message"
        @keydown="handleKeyDown"
      ></el-input>
      <el-button type="primary" class="ml-2" @click="handleSend"
        >发送</el-button
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat {
  padding: 15px;
  box-sizing: border-box;
  &-dialog {
    overflow-y: scroll;
    box-sizing: border-box;
    border-radius: 5px;
    background-color: #f3f3f3;
    height: calc(100vh - 175px);
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
}

.action-bar {
  margin-top: 15px;
}
</style>
