import { useUserStore } from '@/stores/admin/user';
import request from '@/utils/request';

export default class ReportService {
  public static async chatReport(params: {
    channel?: string;
    pageNum?: number;
    pageSize?: number;
    startTime?: number;
    endTime?: number;
    employeeId?: string;
  }): Promise<any> {
    const userStore = useUserStore();
    params.employeeId = userStore.userInfo.id as string;
    return request({
      url: `/report/chatReport`,
      method: 'get',
      params,
    });
  }

  public static async onlineReport(params: {
    channel?: string;
    employeeId?: string;
    pageNum?: number;
    pageSize?: number;
    startTime?: number;
    endTime?: number;
  }): Promise<any> {
    return request({
      url: `/report/onlineCsReport`,
      method: 'get',
      params,
    });
  }

  public static async onlineDetailReport(params: {
    channel?: string;
    employeeId?: string;
    pageNum?: number;
    pageSize?: number;
    startTime?: number;
    endTime?: number;
  }): Promise<any> {
    return request({
      url: `/report/onlineCsReportDetail`,
      method: 'get',
      params,
    });
  }

  public static async sessionReport(params: {
    channel?: string;
    employeeId?: string;
    pageNum?: number;
    pageSize?: number;
    startTime?: number;
    endTime?: number;
  }): Promise<any> {
    return request({
      url: `/report/sessionMessageReport`,
      method: 'get',
      params,
    });
  }

  public static async surveyReport(params: {
    channel?: string;
    employeeId?: string;
    pageNum?: number;
    pageSize?: number;
    startTime?: number;
    endTime?: number;
  }): Promise<any> {
    return request({
      url: `/report/surveyReport`,
      method: 'get',
      params,
    });
  }

  public static async export(params: {
    channel?: string;
    employeeId?: string;
    pageNum?: number;
    pageSize?: number;
    startTime?: number;
    endTime?: number;
    reportType?:
      | 'CHAT_REPORT'
      | 'CS_ONLINE'
      | 'CS_ONLINE_DETAIL'
      | 'SESSION_MESSAGE'
      | 'SURVEY';
  }): Promise<any> {
    return request({
      url: `/report/export`,
      method: 'get',
      responseType: 'blob',
      params: {
        ...params,
      },
    });
  }
}
