import { defineStore } from 'pinia';
import * as Storage from '@/utils/storage';

import { publicRoutes, privateRoutes } from '@/routers';

export const usePermissionStore = defineStore('permissionStore', {
  state: () => ({
    routes: publicRoutes,
    hasSetRoute: false,
  }),
  actions: {
    setHasSetRoute(payload: boolean) {
      this.hasSetRoute = payload;
    },
    /**
     * 增加路由
     */
    setRoutes(newRouts: any[]) {
      this.routes = [...publicRoutes, ...newRouts];
    },
    /**
     * 根据权限数据筛选路由
     */
    filterRoutes(menus: any[]) {
      const routes: any[] = [];
      menus.forEach((key: string) => {
        const result = privateRoutes.filter((item: any) => item.name === key);
        routes.push(...result);
      });
      routes.push({
        path: '/:catchAll(.*)',
        redirect: '/404',
      });

      this.setRoutes(routes);
      this.hasSetRoute = true;
      return routes;
    },
    getInitPermissionPath(menus: any[]) {
      const key = menus.filter((item) => item !== 'chat')[0];
      if (key) {
        const result = privateRoutes.filter((item: any) => item.name === key);
        return result[0].path;
      } else {
        return false;
      }
    },
  },
});
