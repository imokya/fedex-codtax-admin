import { io, Socket } from 'socket.io-client';
import { useUserStore } from '@/stores/admin/user';
import { useChatStore } from '@/stores/chat';
import { getEmitter } from '@/utils/chat/methods';
import { MSG_CONNECT, MSG_DISCONNECT } from '@/constants/chat/event';

export default class SocketClient {
  static instance: SocketClient | null;
  socket!: Socket;

  constructor() {
    const userStore = useUserStore();
    const emitter = getEmitter();

    console.log(
      'host',
      `${import.meta.env.VITE_SOCKET_HOST}?employeeId=${userStore.userInfo.id}`
    );

    this.socket = io(
      `${import.meta.env.VITE_SOCKET_HOST}?employeeId=${userStore.userInfo.id}`, {
        transports: ["websocket", "polling"]
      }
    );
    console.log('socket instance created');
    this.socket.on('connect', () => {
      emitter.emit(MSG_CONNECT);
      console.log('socket connect', this.socket.id);
    });
    this.socket.on('disconnect', (reason: string) => {
      emitter.emit(MSG_DISCONNECT, reason);
      console.log('socket disconnect', reason);
    });
    this.socket.on('error', (error) => {
      console.log('socket error', error);
    });
    this.socket.on('connect_error', (error) => {
      console.log('socket connect error', error);
    });
    this.socket.on('connect_failed', (error) => {
      console.log('socket connect failed', error);
    });
    this.socket.io.on('reconnect_error', (error) => {
      console.log('socket reconnect error', error);
    });
    this.socket.io.on('reconnect_failed', () => {
      console.log('socket reconnect failed');
    });
  }

  public static getInstance() {
    if (!SocketClient.instance) {
      console.log('socket client create');
      SocketClient.instance = new SocketClient();
    }
    return SocketClient.instance;
  }

  public static destroy() {
    if (SocketClient.instance) {
      console.log('socket client destroy', SocketClient.instance.socket);
      SocketClient.instance.socket.disconnect();
      SocketClient.instance.socket.off()
      SocketClient.instance.socket.offAny();
      SocketClient.instance = null;
    }
  }
}
