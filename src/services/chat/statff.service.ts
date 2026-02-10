import request from '@/utils/request';
import { useUserStore } from '@/stores/admin/user';

export default class StaffService {
  public static async changeStatus(status: string): Promise<any> {
    const userStore = useUserStore();
    return request({
      url: `/employee/changeStatus`,
      method: 'put',
      data: {
        employeeId: userStore.userInfo.id,
        employeeLoginStatus: status,
      },
    });
  }

  public static async switch(): Promise<any> {
    const userStore = useUserStore();
    return request({
      url: `/employee/switch`,
      method: 'post',
      data: {
        admin: true,
        employeeId: userStore.userInfo.id,
      },
    });
  }

  public static async logout(): Promise<any> {
    const userStore = useUserStore();
    return request({
      url: `/employee/logout`,
      method: 'post',
      data: {
        employeeId: userStore.userInfo.id,
      },
    });
  }
}
