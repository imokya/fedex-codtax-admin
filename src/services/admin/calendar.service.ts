import request from '@/utils/request';

export default class CalendarService {
  public static async getList(category: string): Promise<any> {
    return request({
      url: `/calendar?category=${category}`,
      method: 'get',
    });
  }

  public static async save(params: {
    category: string;
    date: string;
    type: string;
  }): Promise<any> {
    return request({
      url: `/calendar`,
      data: {
        ...params,
      },
      method: 'post',
    });
  }
}
