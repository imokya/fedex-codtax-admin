import AdminLayout from '@/layouts/admin/index.vue';

export default {
  path: '/admin',
  component: AdminLayout,
  redirect: '/admin/report/survey',
  name: 'surveyManage',
  children: [
    {
      path: '/admin/report/survey',
      name: 'surveyReport',
      component: () => import('@/views/admin/report/Survey/index.vue'),
      meta: {
        title: '税金统计报表',
        icon: 'admin-document',
        order: 5,
        group: '后台管理',
      },
    },
  ],
};
