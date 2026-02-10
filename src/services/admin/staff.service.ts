import request from '@/utils/request';

export default class StaffService {
  public static async getList(params: {
    name?: string;
    channel?: string;
    loginStatus: string;
    pageNum: number;
    pageSize: number;
  }): Promise<any> {
    return request({
      url: `/employee/list`,
      params,
      method: 'get',
    });
  }

  public static async saveCapacity(
    employeeId: string,
    capacity: number
  ): Promise<any> {
    return request({
      url: `/employee/capacity`,
      data: {
        employeeId,
        maximumCapacity: capacity,
      },
      method: 'put',
    });
  }
}
