import request from '@/utils/request';

export default class ChannelService {
  public static async getList(): Promise<any> {
    return request({
      url: `/channel/list`,
      method: 'get',
    });
  }

  public static async saveChannel(params: {
    name: string;
    description?: string;
  }): Promise<any> {
    return request({
      url: `/channel`,
      data: {
        ...params,
      },
      method: 'put',
    });
  }
}
