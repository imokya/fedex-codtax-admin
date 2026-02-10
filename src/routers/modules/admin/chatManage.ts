import AdminLayout from '@/layouts/admin/index.vue';

export default {
  path: '/admin/manage',
  component: AdminLayout,
  redirect: '/admin/manage/chat',
  name: 'chatManage',
  children: [
    {
      path: '/admin/manage/chat',
      component: () => import('@/views/admin/chat/index.vue'),
      meta: {
        title: '聊天消息',
        icon: 'admin-chat',
        group: '后台管理',
        order: 4,
      },
    },
  ],
};
