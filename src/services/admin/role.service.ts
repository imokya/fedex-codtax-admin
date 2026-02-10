import request from '@/utils/request';

interface RoleParams {
  roleName: string;
  permissions: string[];
  description?: string;
  platform?: string;
  displayName?: string;
}

export default class RoleService {
  public static async getPermission(channelName:string): Promise<any> {
    return request({
      url: `/authorization/permission/list`,
      method: 'get',
      params: {
        channelName
      }
    });
  }

  public static async getRoleList(params: {
    pageNum?: number;
    pageSize?: number;
  }): Promise<any> {
    return request({
      url: `/authorization/role/list`,
      method: 'get',
      params,
    });
  }

  public static async updateRole(params: RoleParams): Promise<any> {
    return request({
      url: `/authorization/role`,
      data: {
        ...params,
      },
      method: 'put',
    });
  }

  public static async removeRole(name: string): Promise<any> {
    return request({
      url: `/authorization/role?name=${name}`,
      method: 'delete',
    });
  }

  public static async addRole(params: RoleParams): Promise<any> {
    return request({
      url: `/authorization/role`,
      data: {
        ...params,
      },
      method: 'post',
    });
  }
}
