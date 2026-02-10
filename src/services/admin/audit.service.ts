import request from '@/utils/request';

export default class AuditService {
  public static async getList(params: {
    content?: string;
    employeeId?: string;
    pageNum?: number;
    pageSize?: number;
    userNickName?: string;
    startTime?: number;
    endTime?: number;
  }): Promise<any> {
    return request({
      url: `/chat/history`,
      params,
      method: 'get',
    });
  }
  public static async download(sessionId: string): Promise<any> {
    return request({
      url: `/chat/download?sessionId=${sessionId}`,
      method: 'get',
      responseType: 'blob',
    });
  }
}
