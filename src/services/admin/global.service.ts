import request from '@/utils/request';

export default class GlobalService {
  public static async getConfig(params: any): Promise<any> {
    return request({
      url: `/sysconfig/list`,
      params,
      method: 'get',
    });
  }

  public static async saveConfig(params: any): Promise<any> {
    return request({
      url: `/sysconfig`,
      data: {
        ...params,
      },
      method: 'put',
    });
  }
}
