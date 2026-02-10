import request from '@/utils/request';
import { useUserStore } from '@/stores/admin/user';
import { useChatStore } from '@/stores/chat';

export default class TransferService {
  public static async getList(params: { channelName: string }): Promise<any> {
    const userStore = useUserStore();
    return request({
      url: `/chatbox/transfer/list?employeeId=${userStore.userInfo.id}`,
      method: 'get',
      params,
    });
  }

  public static async accept(params: {
    scopeId: string;
    sessionId: string;
    sourceEmployeeId: string;
    targetEmployeeId: string;
    transferMessage?: string;
    userId: string;
  }): Promise<any> {
    const userStore = useUserStore();
    return request({
      url: `/chatbox/transfer/accept`,
      method: 'put',
      data: {
        ...params,
      },
    });
  }

  public static async reject(params: {
    scopeId: string;
    sessionId: string;
    sourceEmployeeId: string;
    targetEmployeeId: string;
    transferMessage?: string;
    userId: string;
  }): Promise<any> {
    const userStore = useUserStore();
    return request({
      url: `/chatbox/transfer/reject`,
      method: 'put',
      data: {
        ...params,
      },
    });
  }

  public static async transfer(params: {
    targetEmployeeId: string;
    transferMessage?: string;
  }): Promise<any> {
    const userStore = useUserStore();
    const chatStore = useChatStore();
    const currentUser = chatStore.currentUser;
    return request({
      url: `/chatbox/transfer/action`,
      method: 'post',
      data: {
        sourceEmployeeId: userStore.userInfo.id,
        scopeId: currentUser?.scopeId,
        sessionId: currentUser?.sessionId,
        userId: currentUser!.userId,
        targetEmployeeId: params.targetEmployeeId,
        transferMessage: params.transferMessage || '',
      },
    });
  }
}
