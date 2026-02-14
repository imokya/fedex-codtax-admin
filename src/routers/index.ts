import { createRouter, createWebHistory } from 'vue-router';

import surveyManage from './modules/admin/codax/surveyManage';
import uploadManage from './modules/admin/codax/uploadManage';
import messageManage from './modules/admin/codax/messageManage';



import { useUserStore } from '@/stores/admin/user';

/**
 * 公开路由表
 */
export const publicRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/platform/login',
    component: () => import('@/views/auth/index.vue'),
  },

  {
    path: '/401',
    name: '401',
    component: () => import('@/views/error/401.vue'),
  },

  {
    path: '/:catchAll(.*)',
    name: '404',
    component: () => import('@/views/error/404.vue'),
  },
];

/**
 * 私有路由表
 */
export const privateRoutes = [
  surveyManage,
  uploadManage,
  messageManage
];

const router = createRouter({
  history: createWebHistory(),
  routes: [...publicRoutes],
});

export const resetRouter = () => {
  const userStore = useUserStore();
  if (
    userStore.userInfo &&
    userStore.userInfo?.permission &&
    userStore.userInfo?.permission?.menus
  ) {
    const menus = userStore.userInfo.permission.menus;
    menus.forEach((menu: any) => {
      router.removeRoute(menu);
    });
  }
};

export default router;
