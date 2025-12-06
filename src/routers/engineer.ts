/**
 * Engineer 模块路由配置
 * 定义工程师模块的所有路由页面
 */

import type { IEngineerStackParamList } from './types';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import type { ComponentType } from 'react';

/**
 * 路由配置项
 */
export interface IEngineerRouteConfig {
  name: keyof IEngineerStackParamList;
  component: ComponentType<unknown>;
  options?: NativeStackNavigationOptions;
}

/**
 * Engineer 模块路由配置列表
 * 在这里添加该模块的所有路由页面
 */
export const engineerRoutes: IEngineerRouteConfig[] = [
  // {
  //   name: 'EngineerProfile',
  //   component: EngineerProfilePage,
  //   options: {
  //     title: '个人资料',
  //     headerShown: true,
  //   },
  // },
];

/**
 * Engineer 模块默认导航选项
 */
export const engineerDefaultOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'slide_from_right',
};
