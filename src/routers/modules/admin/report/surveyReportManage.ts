import AdminLayout from '@/layouts/admin/index.vue';

export default {
  path: '/admin/report',
  component: AdminLayout,
  redirect: '/admin/report/survey',
  name: 'surveyReportManage',
  children: [
    {
      path: '/admin/report/survey',
      name: 'surveyReport',
      component: () => import('@/views/admin/report/Survey/index.vue'),
      meta: {
        title: '微聊调研统计',
        icon: 'admin-document',
        order: 5,
        group: '数据报表',
      },
    },
  ],
};
