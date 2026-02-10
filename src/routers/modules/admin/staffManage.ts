import AdminLayout from '@/layouts/admin/index.vue';

export default {
  path: '/admin/manage',
  component: AdminLayout,
  redirect: '/admin/manage/staff',
  name: 'staffManage',
  children: [
    {
      path: '/admin/manage/staff',
      component: () => import('@/views/admin/staff/index.vue'),
      meta: {
        title: '工作人员',
        icon: 'admin-headset',
        group: '后台管理',
        order: 3,
      },
    },
  ],
};
