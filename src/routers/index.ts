import { createRouter, createWebHistory } from 'vue-router';

import roleManage from './modules/admin/roleManage';
import staffManage from './modules/admin/staffManage';
import chatManage from './modules/admin/chatManage';

import chatReportManage from './modules/admin/report/chatReportManage';
import surveyReportManage from './modules/admin/report/surveyReportManage';
import messageReportManage from './modules/admin/report/messageReportManage';
import onlineReportManage from './modules/admin/report/onlineReportManage';

import channelManage from './modules/admin/setting/channelManage';
import globalManage from './modules/admin/setting/globalManage';
import timeManage from './modules/admin/setting/timeManage';
import replyManage from './modules/admin/setting/replyManage';

import chat from './modules/admin/chat';

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
  // {
  //   path: '/404',
  //   component: () => import('@/views/error/404.vue'),
  // },
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
  chat,
  roleManage,
  channelManage,
  globalManage,
  timeManage,
  replyManage,
  staffManage,
  chatManage,
  chatReportManage,
  messageReportManage,
  surveyReportManage,
  onlineReportManage,
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
