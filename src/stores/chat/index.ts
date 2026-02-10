import { defineStore } from 'pinia';
import { ChatCardProps, UserStatus } from '@/types/chat';
import { chatList } from './chatList';
import { nextTick } from 'vue';

/**
 * 列表排序，把待选择的放在列表尾部
 */
const sortChatList = (list: ChatCardProps[]) => {
  const tagedList = list.filter(
    (item: ChatCardProps) => item.sessionStatus !== UserStatus.TYPE_REQUIRED
  );
  const untagedList = list.filter(
    (item: ChatCardProps) => item.sessionStatus === UserStatus.TYPE_REQUIRED
  );
  return [...tagedList, ...untagedList];
};

export const useChatStore = defineStore('chatStore', {
  state: () => ({
    chatEnabled: true,
    chatList: sortChatList(chatList) as ChatCardProps[],
    currentChatId: '' as string | number, // 当前会话的用户id
    numInQueue: 0, //渠道内排队人数
    userAvatar: '',
  }),

  actions: {
    setAvatar(avatarUrl: string) {
      this.userAvatar = avatarUrl;
    },
    clearChat() {
      this.currentChatId = '';
    },

    enableChat(payload: boolean) {
      this.chatEnabled = payload;
    },

    setNumInQueue(payload: number) {
      this.numInQueue = payload;
    },

    setChatList(payLoad: ChatCardProps[]) {
      this.chatList = sortChatList(payLoad);
    },

    updateCurrentUser(info: Partial<ChatCardProps>) {
      this.chatList = this.chatList.map((item: ChatCardProps) => {
        if (item.sessionId == this.currentChatId) {
          item = {
            ...item,
            ...info,
          };
        }
        return item;
      });
    },

    // 如果只有一个用户会话，默认选中该会话
    async selectDefaultChat() {
      const chatList = this.chatList.filter(
        (item: ChatCardProps) => item.sessionStatus === UserStatus.STARTED
      );
      if (chatList.length === 1) {
        await nextTick();
        this.setCurrentChatId(chatList[0].sessionId);
      }
    },

    removeCurrentUser() {
      this.chatList = this.chatList.filter(
        (item: ChatCardProps) => item.sessionId != this.currentChatId
      );
    },

    setUserMessage(sessionId: string, message: string) {
      this.chatList = this.chatList.map((item: ChatCardProps) => {
        if (item.sessionId == sessionId) {
          item = {
            ...item,
            unreadCount: item.unreadCount + 1,
            lastMsgContent: message,
            lastMsgTime: +new Date(),
          };
        }
        return item;
      });
    },

    setUserStatus(sessionStatus: UserStatus) {
      this.chatList = this.chatList.map((item: ChatCardProps) => {
        if (item.sessionId == this.currentChatId) {
          item = {
            ...item,
            sessionStatus,
          };
        }
        return item;
      });

      this.chatList = sortChatList(this.chatList);
    },

    selectFirstUser() {
      const list = this.chatList.filter((item) => {
        return item.sessionStatus !== UserStatus.END;
      });
      if (list.length > 0) {
        this.setCurrentChatId(list[0].sessionId);
      } else {
        this.setCurrentChatId('');
      }
    },

    // 选中列表中下一个会话
    selectNextUser() {
      const list = this.chatList.filter((item) => {
        return (
          item.sessionId != this.currentChatId &&
          item.sessionStatus !== UserStatus.END
        );
      });
      if (list.length > 0) {
        this.setCurrentChatId(list[0].sessionId);
      } else {
        this.setCurrentChatId('');
      }
    },

    setCurrentChatId(id: string | number) {
      this.currentChatId = id;
      this.updateCurrentUser({ unreadCount: 0 });
    },

    setChatEnabled(payload: boolean) {
      this.chatEnabled = payload;
    },
  },

  getters: {
    currentScopeId: (state) => {
      const user = state.chatList.find(
        (item: ChatCardProps) => item.sessionId == state.currentChatId
      );
      return user?.scopeId;
    },

    currentUser: (state) => {
      return state.chatList.find(
        (item: ChatCardProps) => item.sessionId == state.currentChatId
      );
    },

    isCurrentUserUntag() {
      const user = this.currentUser as ChatCardProps;
      return user.sessionStatus === UserStatus.TYPE_REQUIRED;
    },

    isCurrentUserChatEnalbed() {
      const user = this.currentUser as ChatCardProps;
      return user && user.sessionStatus === UserStatus.STARTED;
    },

    isChatListEmpty(state) {
      return !state.chatList.some(
        (item: ChatCardProps) => item.sessionStatus != UserStatus.END
      );
    },

    /**
     * 禁用聊天逻辑
     * 当聊天列表中无可聊天用户
     * 当前用户未完成聊天
     */
    isChatEnalbed(): boolean {
      return (
        this.isCurrentUserChatEnalbed &&
        this.chatEnabled &&
        !this.isChatListEmpty
      );
    },

    isChatHistoryEnabled(): boolean {
      return this.currentChatId !== '';
    },

    hasUndoneChat(state) {
      return state.chatList.some(
        (item: ChatCardProps) => item.sessionStatus === UserStatus.STARTED
      );
    },

    hasUnTagChat(state) {
      return state.chatList.some(
        (item: ChatCardProps) => item.sessionStatus === UserStatus.TYPE_REQUIRED
      );
    },
  },
});
