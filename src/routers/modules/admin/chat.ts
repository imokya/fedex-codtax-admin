import ChatLayout from '@/layouts/chat/index.vue';

export default {
  path: '/',
  component: ChatLayout,
  redirect: '/chat',
  name: 'chat',
  children: [
    {
      path: '/chat',
      component: () => import('@/views/chat/index.vue'),
      // meta: {
      //   title: '聊天',
      //   icon: 'admin-chat',
      //   group: '后台管理',
      //   order: 4,
      // },
    },
  ],
};
