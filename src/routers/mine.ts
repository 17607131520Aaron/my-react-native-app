/**
 * Mine 模块路由配置
 * 定义"我的"模块的所有路由页面
 */

import AboutPage from '~/pages/About';
import LoginPage from '~/pages/Login';

import type { IMineStackParamList } from './types';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import type { ComponentType } from 'react';

/**
 * 路由配置项
 */
export interface IMineRouteConfig {
  name: keyof IMineStackParamList;
  component: ComponentType<unknown>;
  options?: NativeStackNavigationOptions;
}

/**
 * Mine 模块路由配置列表
 * 在这里添加该模块的所有路由页面
 */
export const mineRoutes: IMineRouteConfig[] = [
  {
    name: 'About',
    component: AboutPage,
    options: {
      title: '关于',
      headerShown: true,
    },
  },
  {
    name: 'Login',
    component: LoginPage,
    options: {
      title: '登录',
      headerShown: true,
    },
  },
];

/**
 * Mine 模块默认导航选项
 */
export const mineDefaultOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'slide_from_right',
};
