import AdminLayout from '@/layouts/admin/index.vue';

export default {
  path: '/admin/manage',
  component: AdminLayout,
  redirect: '/admin/manage/reply',
  name: 'replyManage',
  meta: {
    title: '内容数据',
    icon: 'admin-paper',
    group: '后台管理',
    order: 2,
  },
  children: [
    {
      path: '/admin/manage/reply',
      component: () => import('@/views/admin/setting/reply/index.vue'),
      meta: {
        title: '公共回复模板',
        icon: 'admin-chat',
        group: '后台管理',
        hideIcon: true,
        order: 4,
      },
    },
  ],
};
