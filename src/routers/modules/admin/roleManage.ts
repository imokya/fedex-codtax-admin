import AdminLayout from '@/layouts/admin/index.vue';

export default {
  path: '/admin/manage',
  component: AdminLayout,
  redirect: '/admin/manage/role',
  name: 'roleManage',
  children: [
    {
      path: '/admin/manage/role',
      component: () => import('@/views/admin/role/index.vue'),
      meta: {
        title: '角色权限',
        icon: 'admin-role',
        group: '后台管理',
        order: 1,
      },
    },
  ],
};
