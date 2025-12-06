/**
 * 路由配置汇总
 * 统一管理所有模块的路由配置，支持直接根据路由名称跳转
 */

import { engineerDefaultOptions, engineerRoutes } from './engineer';
import { institutionDefaultOptions, institutionRoutes } from './institution';
import { mineDefaultOptions, mineRoutes } from './mine';

import type { IAllRoutesParamList, IRootStackParamList } from './types';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import type { ComponentType } from 'react';

// ==================== 路由配置类型 ====================
export interface IRouteConfig {
  name: keyof IAllRoutesParamList;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
  options?: NativeStackNavigationOptions;
}

// ==================== 合并所有模块的路由配置 ====================
/**
 * 所有路由的扁平化配置
 * 将所有模块的路由合并到一个数组中，支持直接根据路由名称跳转
 */
export const allRoutes: IRouteConfig[] = [...engineerRoutes, ...institutionRoutes, ...mineRoutes];

// ==================== 路由到模块的映射 ====================
/**
 * 根据路由名称自动判断所属模块
 * 用于支持嵌套导航结构下的跨模块跳转
 */
export function getRouteModule(routeName: keyof IAllRoutesParamList): keyof IRootStackParamList {
  // Engineer 模块的路由
  if (engineerRoutes.some((route) => route.name === routeName)) {
    return 'Engineer';
  }
  // Institution 模块的路由
  if (institutionRoutes.some((route) => route.name === routeName)) {
    return 'Institution';
  }
  // Mine 模块的路由
  if (mineRoutes.some((route) => route.name === routeName)) {
    return 'Mine';
  }
  // 默认返回 Mine（如果找不到，可能是公共路由）
  return 'Mine';
}

// ==================== 模块配置（用于嵌套导航） ====================
export interface IModuleConfig {
  moduleName: keyof IRootStackParamList;
  routes: IRouteConfig[];
  defaultOptions: NativeStackNavigationOptions;
}

export const moduleConfigs: {
  Engineer: IModuleConfig;
  Institution: IModuleConfig;
  Mine: IModuleConfig;
} = {
  Engineer: {
    moduleName: 'Engineer',
    routes: engineerRoutes,
    defaultOptions: engineerDefaultOptions,
  },
  Institution: {
    moduleName: 'Institution',
    routes: institutionRoutes,
    defaultOptions: institutionDefaultOptions,
  },
  Mine: {
    moduleName: 'Mine',
    routes: mineRoutes,
    defaultOptions: mineDefaultOptions,
  },
};

// ==================== 导出所有路由配置 ====================
export { engineerDefaultOptions, engineerRoutes } from './engineer';
export { institutionDefaultOptions, institutionRoutes } from './institution';
export { mineDefaultOptions, mineRoutes } from './mine';

// ==================== 路由查找工具 ====================
/**
 * 根据路由名称查找路由配置
 */
export function findRouteConfig(routeName: keyof IAllRoutesParamList): IRouteConfig | undefined {
  return allRoutes.find((route) => route.name === routeName);
}

/**
 * 获取模块的所有路由配置
 */
export function getModuleRoutes(moduleName: keyof typeof moduleConfigs): IRouteConfig[] {
  return moduleConfigs[moduleName]?.routes ?? [];
}

/**
 * 获取模块的默认导航选项
 */
export function getModuleDefaultOptions(
  moduleName: keyof typeof moduleConfigs,
): NativeStackNavigationOptions {
  return moduleConfigs[moduleName]?.defaultOptions ?? {};
}

// ==================== 导出类型 ====================
export type {
  AllRoutesParamList,
  EngineerStackParamList,
  IAllRoutesParamList,
  IEngineerStackParamList,
  INstitutionStackParamList,
  IMineStackParamList,
  InstitutionStackParamList,
  IRootStackParamList,
  MineStackParamList,
  RootStackParamList,
} from './types';

export { ROUTE_NAMES } from './types';
