import path from 'path-browserify';

/**
 * 获取包含子集的路由
 */
const getChildrenRoutes = (routes: any[]) => {
  const result: any[] = [];
  routes.forEach((route: any) => {
    if (route.children && route.children.length > 0) {
      result.push(...route.children);
    }
  });
  return result;
};

/**
 * 处理脱离层级的路由
 */
export const filterRoutes = (routes: any[]) => {
  // 获取所有子集路由
  const childrenRoutes = getChildrenRoutes(routes);
  // 根据子集路由进行查重操作
  return routes.filter((route: any) => {
    return !childrenRoutes.find((childrenRoute: any) => {
      return childrenRoute.path === route.path;
    });
  });
};

const isNull = (data: any) => {
  if (!data) return true;
  if (JSON.stringify(data) === '{}') return true;
  if (JSON.stringify(data) === '[]') return true;
  return false;
};

/**
 * 根据 routes 数据，返回对应的 menu 规则数据
 */
export const generateMenus = (routes: any[], basePath = '') => {
  const result: any[] = [];
  // 过滤不满足条件的数据
  routes.forEach((item: any) => {
    if (isNull(item.children) && isNull(item.meta)) return;
    if (isNull(item.meta) && !isNull(item.children)) {
      result.push(...generateMenus(item.children));
      return;
    }
    const routePath = path.resolve(basePath, item.path);
    // 路由分离后，可能存在同名父路由
    let route = result.find((item: any) => item.path === routePath);
    if (!route) {
      route = {
        ...item,
        path: routePath,
        children: [],
      };
      if (route.meta.icon && route.meta.title) {
        result.push(route);
      }
    }
    // 存在 children && 存在 meta
    if (!isNull(item.children)) {
      route.children.push(...generateMenus(item.children, route.path));
    }
  });

  return result;
};
