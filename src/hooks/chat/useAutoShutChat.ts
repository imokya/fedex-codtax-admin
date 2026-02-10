import { getEmitter } from '@/utils/chat/methods';
import {
  EVENT_CHAT_INIT,
  EVENT_CHAT_OVER,
  EVENT_CHAT_OVER_REMIN,
  EVENT_MESSAGE,
} from '@/constants/chat/event';

import {
  CHAT_OVER_REMIND_INTERVAL,
  CHAT_OVER_INTERVAL,
} from '@/constants/chat';

import { useChatStore } from '@/stores/chat';

export default function () {
  const emitter = getEmitter();
  let startTime = +new Date();
  let isOver = false;
  let isRemind = false;
  let id: any;

  const checkChatIdle = () => {
    const nowTime = +new Date();
    const interval = (nowTime - startTime) / 1000 / 60;

    if (interval > CHAT_OVER_REMIND_INTERVAL && !isRemind) {
      emitter.emit(EVENT_CHAT_OVER_REMIN);
      isRemind = true;
    }
    if (interval > CHAT_OVER_INTERVAL + CHAT_OVER_REMIND_INTERVAL) {
      emitter.emit(EVENT_CHAT_OVER);
      clear();
    }
    if (!isOver) {
      id = setTimeout(checkChatIdle, 300);
    }
  };

  const clear = () => {
    clearTimeout(id);
    isOver = true;
  };

  const refresh = () => {
    startTime = +new Date();
    isRemind = false;
    isOver = false;
  };

  emitter.on(EVENT_MESSAGE, () => {
    refresh();
  });

  emitter.on(EVENT_CHAT_OVER, () => {
    clear();
  });

  emitter.on(EVENT_CHAT_INIT, () => {
    const chatStore = useChatStore();
    if (chatStore.isCurrentUserChatEnalbed) {
      refresh();
      if (id) clearTimeout(id);
      checkChatIdle();
    }
  });

  return {
    refresh,
  };
}
