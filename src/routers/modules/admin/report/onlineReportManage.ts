import AdminLayout from '@/layouts/admin/index.vue';

export default {
  path: '/admin/report',
  component: AdminLayout,
  redirect: '/admin/report/online',
  name: 'onlineReportManage',
  children: [
    {
      path: '/admin/report/online',
      name: 'onlineReport',
      component: () => import('@/views/admin/report/Online/index.vue'),
      meta: {
        title: '在线客服',
        icon: 'admin-online',
        order: 5,
        group: '数据报表',
      },
    },
  ],
};
