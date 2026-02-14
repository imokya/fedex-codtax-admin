import AdminLayout from '@/layouts/admin/index.vue';

export default {
  path: '/admin',
  component: AdminLayout,
  redirect: '/admin/codtax/message',
  name: 'messageManage',
  children: [
    {
      path: '/admin/codtax/message',
      name: 'messageSetting',
      component: () => import('@/views/admin/setting/Message/index.vue'),
      meta: {
        title: '税金通知设置',
        icon: 'admin-chat',
        order: 5,
        group: '后台管理',
      },
    },
  ],
};
