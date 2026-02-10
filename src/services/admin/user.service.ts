import request from '@/utils/request';

export default class UserService {
  public static async login(employeeId: string): Promise<any> {
    return request({
      url: `/login?employeeId=${employeeId}`,
      method: 'get',
    });
  }

  public static async auth(code: string): Promise<any> {
    return request({
      url: `/auth/info?code=${code}`,
      method: 'get',
    });
  }
}

// public static async login(
//   username: string,
//   password: string,
//   employeeId: string
// ): Promise<any> {
//   const id = employeeId || '12333';
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve({
//         success: true,
//         code: 1,
//         token: 'user token',
//         userInfo: {
//           id,
//           name: `工号${id}`,
//           permission: {
//             menus: [
//               'chat',
//               'roleManage',
//               // 'channelManage',
//               // 'globalManage',
//               // 'timeManage',
//               // 'staffManage',
//               // 'chatManage',
//               // 'chatReportManage',
//               // 'messageReportManage',
//               // 'surveyReportManage',
//               // 'onlineReportManage',
//             ],
//           },
//         },
//       });
//     }, 1000);
//   });
// }
