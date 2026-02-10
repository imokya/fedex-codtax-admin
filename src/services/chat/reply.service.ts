import request from '@/utils/request';
import { useUserStore } from '@/stores/admin/user';

type ReplyType = 'PRIVATE' | 'PUBLIC';

export default class ReplyService {
  public static async getCategory(type: ReplyType = 'PRIVATE'): Promise<any> {
    const userStore = useUserStore();
    return request({
      url: `/quickReply/category`,
      method: 'get',
      params: {
        categoryType: type,
        // employeeId: userStore.userInfo.id,
      },
    });
  }

  public static async reorderCategory(categoryIds: string[]): Promise<any> {
    return request({
      url: `/quickReply/category/reorder`,
      method: 'post',
      data: {
        categoryIds,
      },
    });
  }

  public static async reorderReply(
    categoryId: string,
    replyIds: string[]
  ): Promise<any> {
    return request({
      url: `/quickReply/detail/reorder`,
      method: 'post',
      data: {
        categoryId,
        detailIds: replyIds,
      },
    });
  }

  public static async createCategory(
    text: string,
    type: ReplyType = 'PRIVATE'
  ): Promise<any> {
    const userStore = useUserStore();
    return request({
      url: `/quickReply/category`,
      method: 'put',
      data: {
        categoryName: text,
        // employeeId: userStore.userInfo.id,
        type,
      },
    });
  }

  public static async removeCategory(categoryId: string): Promise<any> {
    return request({
      url: `/quickReply/category?id=${categoryId}`,
      method: 'delete',
    });
  }

  public static async modifyCategory(
    categoryId: string,
    text: string
  ): Promise<any> {
    return request({
      url: `/quickReply/category`,
      method: 'patch',
      data: {
        categoryId,
        categoryName: text,
      },
    });
  }

  public static async createReply(
    categoryId: string,
    text: string
  ): Promise<any> {
    return request({
      url: `/quickReply/detail`,
      method: 'put',
      data: {
        categoryId,
        content: text,
      },
    });
  }

  public static async removeReply(id: string): Promise<any> {
    return request({
      url: `/quickReply/detail?id=${id}`,
      method: 'delete',
    });
  }

  public static async modifyReply(id: string, text: string): Promise<any> {
    return request({
      url: `/quickReply/detail`,
      method: 'patch',
      data: {
        quickReplyId: id,
        content: text,
      },
    });
  }
}
