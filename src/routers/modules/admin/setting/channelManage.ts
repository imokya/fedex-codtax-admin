import AdminLayout from '@/layouts/admin/index.vue';

export default {
  path: '/admin/manage',
  component: AdminLayout,
  redirect: '/admin/manage/channel',
  name: 'channelManage',
  meta: {
    title: '内容数据',
    icon: 'admin-paper',
    group: '后台管理',
    order: 2,
  },
  children: [
    {
      path: '/admin/manage/channel',
      component: () => import('@/views/admin/setting/channel/index.vue'),
      meta: {
        title: '渠道管理',
        icon: 'admin-chat',
        group: '后台管理',
        hideIcon: true,
        order: 1,
      },
    },
  ],
};
