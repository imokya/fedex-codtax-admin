import dayjs from 'dayjs';
import { defineStore } from 'pinia';
import { Message, MessageStatus, MessageType } from '@/types/chat';
import { insertSystemTime } from '@/utils/chat/message';

export const messageData: Message[] = [
  // {
  //   type: MessageType.USER,
  //   message: '我要转人工客服',
  //   mediaType: 'text',
  //   name: '行歌',
  //   time: +dayjs('2024-12-12 10:00'),
  // },
  // {
  //   type: MessageType.CHATBOT,
  //   message: '请稍后...',
  //   mediaType: 'text',
  //   name: '微信机器人',
  //   time: +dayjs('2024-12-12 10:01'),
  // },
  // {
  //   type: MessageType.SYSTEM,
  //   message: '感谢您的等候，现由人工客服12345为您解决问题',
  //   time: +dayjs('2024-12-13 10:58'),
  // },
  // {
  //   type: MessageType.EMPLOYEE,
  //   message: '你好，请问有什么可以帮助你嘛？',
  //   name: '人工客服12345',
  //   mediaType: 'text',
  //   time: +dayjs('2024-12-13 11:00'),
  // },
];

export const useMessageStore = defineStore('messageStore', {
  state: () => ({
    messageList: [...insertSystemTime(messageData)] as Message[],
  }),
  actions: {
    setMessageStatus(seq: string, status: MessageStatus) {
      this.messageList = this.messageList.map((item: Message) => {
        if (item.seq && item.seq === seq) {
          return {
            ...item,
            status,
          };
        }
        return item;
      });
    },
    setMessageList(payload: Message[]) {
      this.messageList = [...payload];
    },
    resetMessageList() {
      this.messageList = [...insertSystemTime(messageData)];
    },
    clearMessageList() {
      this.messageList = [];
    },
    hasTypeSelect() {
      return this.messageList.some(
        (item: Message) => item.type === MessageType.TYPE_SELECT
      );
    },
  },
});
