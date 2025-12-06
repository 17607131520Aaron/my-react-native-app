/**
 * 路由配置汇总
 * 统一管理所有模块的路由配置
 */
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { engineerDefaultOptions, engineerRoutes } from './engineer';
import { institutionDefaultOptions, institutionRoutes } from './institution';
import { mineDefaultOptions, mineRoutes } from './mine';

import type {
  IEngineerStackParamList,
  IInstitutionStackParamList,
  IMineStackParamList,
} from './types';

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

// ==================== 创建各模块的 Stack Navigator ====================
const EngineerStack = createNativeStackNavigator<IEngineerStackParamList>();
const InstitutionStack = createNativeStackNavigator<IInstitutionStackParamList>();
const MineStack = createNativeStackNavigator<IMineStackParamList>();

// ==================== 导出 Tab Screen 组件 ====================

/**
 * 工程师首页 Tab Screen
 */
export const EngineerHomeScreen = (): React.JSX.Element => {
  return (
    <EngineerStack.Navigator screenOptions={engineerDefaultOptions}>
      {engineerRoutes.map((route) => (
        <EngineerStack.Screen
          key={route.name}
          component={route.component}
          name={route.name}
          options={route.options}
        />
      ))}
    </EngineerStack.Navigator>
  );
};

/**
 * 机构首页 Tab Screen
 */
export const InstitutionHomeScreen = (): React.JSX.Element => {
  return (
    <InstitutionStack.Navigator screenOptions={institutionDefaultOptions}>
      {institutionRoutes.map((route) => (
        <InstitutionStack.Screen
          key={route.name}
          component={route.component}
          name={route.name}
          options={route.options}
        />
      ))}
    </InstitutionStack.Navigator>
  );
};

/**
 * 我的 Tab Screen
 */
export const MineScreen = (): React.JSX.Element => {
  return (
    <MineStack.Navigator screenOptions={mineDefaultOptions}>
      {mineRoutes.map((route) => (
        <MineStack.Screen
          key={route.name}
          component={route.component}
          name={route.name}
          options={route.options}
        />
      ))}
    </MineStack.Navigator>
  );
};
