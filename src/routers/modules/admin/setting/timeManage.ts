import AdminLayout from '@/layouts/admin/index.vue';

export default {
  path: '/admin/manage',
  component: AdminLayout,
  redirect: '/admin/manage/time',
  name: 'timeManage',
  meta: {
    title: '内容数据',
    icon: 'admin-paper',
    group: '后台管理',
    order: 2,
  },
  children: [
    {
      path: '/admin/manage/time',
      component: () => import('@/views/admin/setting/time/index.vue'),
      meta: {
        title: '工作时长',
        icon: 'admin-chat',
        group: '后台管理',
        hideIcon: true,
        order: 3,
      },
    },
  ],
};
