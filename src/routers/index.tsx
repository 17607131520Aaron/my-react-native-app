/**
 * 路由配置汇总
 * 统一管理所有模块的路由配置
 */
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { engineerDefaultOptions, engineerRoutes } from './engineer';
import { institutionDefaultOptions, institutionRoutes } from './institution';
import { mineDefaultOptions, mineRoutes } from './mine';

import type { IAllRoutesParamList } from './types';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import type { ComponentType } from 'react';

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
  IMineStackParamList,
  InstitutionStackParamList,
  IRootStackParamList,
  MineStackParamList,
  RootStackParamList,
  TRouteName,
} from './types';

export { ROUTE_NAMES } from './types';

// ==================== 创建统一的 Stack Navigator ====================
const AppStack = createNativeStackNavigator<IAllRoutesParamList>();

// ==================== 合并所有路由配置 ====================
interface IRouteConfig {
  name: keyof IAllRoutesParamList;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
  options?: NativeStackNavigationOptions;
}

// 合并所有模块的路由
const allRoutes: IRouteConfig[] = [
  ...engineerRoutes,
  ...institutionRoutes,
  ...mineRoutes,
] as IRouteConfig[];

// 默认导航选项
const defaultScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'slide_from_right',
};

// ==================== 导出统一的 Screen 组件 ====================

/**
 * 工程师首页 Tab Screen（包含所有路由）
 */
export const EngineerHomeScreen = (): React.JSX.Element => {
  return (
    <AppStack.Navigator screenOptions={{ ...defaultScreenOptions, ...engineerDefaultOptions }}>
      {allRoutes.map((route) => (
        <AppStack.Screen
          key={route.name}
          component={route.component}
          name={route.name}
          options={route.options}
        />
      ))}
    </AppStack.Navigator>
  );
};

/**
 * 机构首页 Tab Screen（包含所有路由）
 */
export const InstitutionHomeScreen = (): React.JSX.Element => {
  return (
    <AppStack.Navigator screenOptions={{ ...defaultScreenOptions, ...institutionDefaultOptions }}>
      {allRoutes.map((route) => (
        <AppStack.Screen
          key={route.name}
          component={route.component}
          name={route.name}
          options={route.options}
        />
      ))}
    </AppStack.Navigator>
  );
};

/**
 * 我的 Tab Screen（包含所有路由）
 */
export const MineScreen = (): React.JSX.Element => {
  return (
    <AppStack.Navigator screenOptions={{ ...defaultScreenOptions, ...mineDefaultOptions }}>
      {allRoutes.map((route) => (
        <AppStack.Screen
          key={route.name}
          component={route.component}
          name={route.name}
          options={route.options}
        />
      ))}
    </AppStack.Navigator>
  );
};
