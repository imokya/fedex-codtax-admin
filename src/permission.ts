import router from '@/routers';
import { useUserStore } from './stores/admin/user';
import { usePermissionStore } from './stores/admin/permission';
import { goLogin } from './utils/methods';

// 白名单

const whiteList = ['/login', '/auth', '/404', '/401', '/platform/login'];

/**
 * 路由前置守卫
 */

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const permissionStore = usePermissionStore();

  if (userStore.token) {
    if (to.path === '/login' || to.path === '/platform/login') {
      next();
    } else {
      if (userStore.hasUserInfo) {
        // 根据用户权限数据设置路由
        const { permission } = userStore.userInfo;

        if (!permissionStore.hasSetRoute) {
          const filterRoutes = permissionStore.filterRoutes(permission.menus);
          filterRoutes.forEach((item: any) => {
            router.addRoute(item);
          });

          // 添加完要主动跳转一次才能生效
          return next(to.path);
        }

        // 后台用户跳转到可以访问的第一个路由
        if (to.path === '/admin') {
          const path = permissionStore.getInitPermissionPath(permission.menus);
          if (path) {
            return next(path);
          }
        }
      }
      next();
    }
  } else {
    if (whiteList.indexOf(to.path) > -1) {
      next();
    } else {
      goLogin();
      // next('/login');
    }
  }
});
