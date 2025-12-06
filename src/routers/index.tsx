/**
 * 路由配置汇总
 * 统一管理所有模块的路由配置
 */

import { engineerRoutes } from './engineer';
import { institutionRoutes } from './institution';
import { mineRoutes } from './mine';

import type { IRouteConfig } from './types';

// ==================== 导出各模块路由配置 ====================
export { engineerDefaultOptions, engineerRoutes } from './engineer';
export { institutionDefaultOptions, institutionRoutes } from './institution';
export { mineDefaultOptions, mineRoutes } from './mine';

// ==================== 导出类型 ====================
export type {
  AllRoutesParamList,
  EngineerStackParamList,
  IAllRoutesParamList,
  IEngineerStackParamList,
  IInstitutionStackParamList,
  IMainTabParamList,
  IMineStackParamList,
  IModuleRoutes,
  InstitutionStackParamList,
  IRouteConfig,
  IRootStackParamList,
  MineStackParamList,
  RootStackParamList,
  TRouteName,
} from './types';

export { ROUTE_NAMES } from './types';

// ==================== 路由聚合函数 ====================

/**
 * 聚合所有模块的路由配置
 * 过滤掉 Tab 首页，只返回需要注册到 Root Stack 的页面
 */
export function getAllRoutes(): IRouteConfig[] {
  const allModuleRoutes: IRouteConfig[] = [...engineerRoutes, ...institutionRoutes, ...mineRoutes];

  // 过滤掉 Tab 首页
  return allModuleRoutes.filter((route) => !route.isTabHome);
}

/**
 * 获取各模块的首页配置（用于 Tab Navigator）
 */
export function getTabHomeRoutes(): Record<string, IRouteConfig | undefined> {
  return {
    engineer: engineerRoutes.find((r) => r.isTabHome),
    institution: institutionRoutes.find((r) => r.isTabHome),
    mine: mineRoutes.find((r) => r.isTabHome),
  };
}
