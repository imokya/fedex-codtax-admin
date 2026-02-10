import AdminLayout from '@/layouts/admin/index.vue';

export default {
  path: '/admin',
  component: AdminLayout,
  redirect: '/admin/codtax/upload',
  name: 'uploadManage',
  children: [
    {
      path: '/admin/codtax/upload',
      name: 'codtaxUpload',
      component: () => import('@/views/admin/codtax/Upload/index.vue'),
      meta: {
        title: '税金数据上传',
        icon: 'admin-paper',
        order: 5,
        group: '后台管理',
      },
    },
  ],
};
