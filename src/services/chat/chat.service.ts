import request from '@/utils/request';
import { useUserStore } from '@/stores/admin/user';
import { useChatStore } from '@/stores/chat';

export interface ChatHistoryParams {
  sessionId?: string | number;
  scopeId?: string | number;
  userId?: string | number;
  keyWord?: string;
  startTime?: number;
  endTime?: number;
  size?: number;
  page?: number;
  platform?: 0 | 1; // 0前端请求，1后台管理请求
}

export default class ChatService {
  public static async getChatList(): Promise<any> {
    const userStore = useUserStore();
    return request({
      url: `/homepage/load?employeeId=${userStore.userInfo.id}`,
      method: 'get',
    });
  }

  public static async refresh(): Promise<any> {
    const userStore = useUserStore();
    return request({
      url: `/homepage/refresh?employeeId=${userStore.userInfo.id}`,
      method: 'get',
    });
  }

  public static async getChatHistory(params?: ChatHistoryParams): Promise<any> {
    return request({
      url: `/chatbox/history`,
      method: 'get',
      params,
    });
  }

  public static async endChat(): Promise<any> {
    const chatStore = useChatStore();
    const userStore = useUserStore();
    const currentUser = chatStore.currentUser;
    return request({
      url: `/employee/endConversation`,
      method: 'post',
      data: {
        employeeId: userStore.userInfo.id,
        scopeId: currentUser!.scopeId,
        sessionId: currentUser!.sessionId,
        userId: currentUser!.userId,
      },
    });
  }

  public static async setChatType(
    type: string,
    sessionId?: string
  ): Promise<any> {
    const chatStore = useChatStore();
    const _sessionId = sessionId || chatStore.currentUser?.sessionId;
    return request({
      url: `/chatbox/type/select`,
      method: 'put',
      data: {
        type,
        sessionId: _sessionId,
      },
    });
  }
}
