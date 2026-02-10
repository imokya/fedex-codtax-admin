import SocketClient from '@/socket';
import {
  MSG_READ,
  MSG_SESSION_END,
  MSG_SEND_TO_USER,
  MSG_SESSION_START,
  MSG_SEND_TO_USER_RESULT,
  MSG_SEND_TO_EMPLOYEE,
  MSG_TRANSFER_REQUEST,
  MSG_TRANSFER_RESPONSE,
  EVENT_CHAT_OVER,
  EVENT_USER_MESSAGE,
  EVENT_CHAT_TRANSFER_REQUEST,
  EVENT_REFESH_LIST,
} from '@/constants/chat/event';
import { useChatStore } from '@/stores/chat';
import { useMessageStore } from '@/stores/chat/message';
import { getEmitter, showError, showSuccess, wait } from '@/utils/methods';

import { Howl } from 'howler';

const beepSound = new Howl({
  src: ['/sound/beep.mp3'],
});

type CallBackType = (args: any) => void

export default function () {
  const emitter = getEmitter();
  const chatStore = useChatStore();
  const messageStore = useMessageStore();

  const socket = SocketClient.getInstance().socket;

  socket.on(MSG_SESSION_START, async (data: any, callback: CallBackType) => {
    console.log('SESSION_START', data);
    callback && callback('ok')
    await wait(1000);
    emitter.emit(EVENT_REFESH_LIST);
    beepSound.play();
  });

  // 忙碌客服转接
  socket.on(MSG_TRANSFER_REQUEST, (data: any, callback: CallBackType) => {
    console.log('MSG_TRANSFER_REQUEST', data);
    callback && callback('ok')
    emitter.emit(EVENT_CHAT_TRANSFER_REQUEST, data);
  });

  socket.on(MSG_TRANSFER_RESPONSE, (data: { isAccept: boolean }, callback: CallBackType) => {
    console.log('TRANSFER_RESPONSE', data);
    callback && callback('ok')
    if (data?.isAccept) {
      showSuccess('转接成功');
    } else {
      showError('转接被拒绝');
    }
    emitter.emit(EVENT_REFESH_LIST);
  });

  socket.on(MSG_SESSION_END, (data: any, callback: CallBackType) => {
    console.log('SESSION_END', data);
    callback && callback('ok')
    emitter.emit(EVENT_CHAT_OVER, data);
    emitter.emit(EVENT_REFESH_LIST);
  });

  socket.on(MSG_SEND_TO_EMPLOYEE, (data: any, callback: CallBackType) => {
    console.log('MSG_SEND_TO_EMPLOYEE', data);
    callback && callback('ok')
    emitter.emit(EVENT_USER_MESSAGE, data);
    emitter.emit(EVENT_REFESH_LIST);
    beepSound.play();
  });

  socket.on(MSG_SEND_TO_USER_RESULT, (data: any, callback: CallBackType) => {
    if (data?.result === 'FAILED') {
      showError(data.reason || '发送消息出错');
      messageStore.setMessageStatus(data.seq, 'fail');
    } else {
      messageStore.setMessageStatus(data.seq, 'success');
    }
    console.log('MSG_SEND_TO_USER_RESULT', data);
    callback && callback('ok')
    // 客服发消息要刷新左侧聊天列表
    setTimeout(() => {
      emitter.emit(EVENT_REFESH_LIST);
    }, 100);
  });

  const sendMessageRead = (messageId?: '') => {
    const currentUser = chatStore.currentUser;
    socket.emit(MSG_READ, {
      sessionId: currentUser!.sessionId,
      messageId,
    });
  };

  /**
   * 发送消息到用户
   * @param message 消息内容
   * @param seq 消息序号
   * @param resendFlag 是否是重发 0: 否 1: 是
   */
  const sendMessageToUser = (message: string, seq: string, resendFlag = 0) => {
    const currentUser = chatStore.currentUser;
    console.log('MSG_SEND_TO_USER', currentUser);
    socket.emit(MSG_SEND_TO_USER, {
      userId: currentUser!.userId,
      scopeId: currentUser!.scopeId,
      sessionId: currentUser!.sessionId,
      content: message,
      resendFlag,
      seq,
    });
  };

  const sendTransferResponse = (isAccept: boolean) => {
    console.log('sendTransferResponse', isAccept);
    socket.emit(MSG_TRANSFER_RESPONSE, isAccept);
  };

  return {
    sendMessageToUser,
    sendMessageRead,
    sendTransferResponse,
  };
}
