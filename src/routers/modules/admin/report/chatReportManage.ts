import AdminLayout from '@/layouts/admin/index.vue';

export default {
  path: '/admin/report',
  component: AdminLayout,
  redirect: '/admin/report/chat',
  name: 'chatReportManage',
  children: [
    {
      path: '/admin/report/chat',
      name: 'chatReport',
      component: () => import('@/views/admin/report/chat.vue'),
      meta: {
        title: '聊天统计',
        icon: 'admin-statistic',
        order: 5,
        group: '数据报表',
      },
    },
  ],
};
