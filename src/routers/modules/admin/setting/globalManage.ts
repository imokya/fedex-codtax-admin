import AdminLayout from '@/layouts/admin/index.vue';

export default {
  path: '/admin/manage',
  component: AdminLayout,
  redirect: '/admin/manage/global',
  name: 'globalManage',
  meta: {
    title: '内容数据',
    icon: 'admin-paper',
    group: '后台管理',
    order: 2,
  },
  children: [
    {
      path: '/admin/manage/global',
      component: () => import('@/views/admin/setting/global/index.vue'),
      meta: {
        title: '全局设置',
        icon: 'admin-chat',
        group: '后台管理',
        hideIcon: true,
        order: 2,
      },
    },
  ],
};
