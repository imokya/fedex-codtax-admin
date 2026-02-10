import { defineStore } from 'pinia';
import {
  CHAT_OVER_REMIND_INTERVAL,
  CHAT_OVER_INTERVAL,
} from '@/constants/chat';

export const useChatSettingStore = defineStore('chatSettingStore', {
  state: () => ({
    chat_over_remind_interval: CHAT_OVER_REMIND_INTERVAL,
    chat_over_interval: CHAT_OVER_INTERVAL,
  }),
  actions: {},
});
