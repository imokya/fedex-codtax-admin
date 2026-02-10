import AdminLayout from '@/layouts/admin/index.vue';

export default {
  path: '/admin/report',
  component: AdminLayout,
  redirect: '/admin/report/message',
  name: 'messageReportManage',
  children: [
    {
      path: '/admin/report/message',
      name: 'messageReport',
      component: () => import('@/views/admin/report/message.vue'),
      meta: {
        title: '会话消息',
        icon: 'admin-group-chat',
        order: 5,
        group: '数据报表',
      },
    },
  ],
};
