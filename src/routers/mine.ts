/**
 * Mine 模块路由配置
 * 定义"我的"模块的所有路由页面
 */

import AboutPage from '~/pages/About';
import LoginPage from '~/pages/Login';

import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import type { ComponentType } from 'react';
import type { IMineStackParamList } from './types';

// 导入页面组件
// import MineHomePage from '~/pages/Mine/Home';
// import MineProfilePage from '~/pages/Mine/Profile';
// import MineSettingsPage from '~/pages/Mine/Settings';

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
  // {
  //   name: 'MineHome',
  //   component: MineHomePage,
  //   options: {
  //     title: '我的',
  //     headerShown: true,
  //   },
  // },
  // {
  //   name: 'MineProfile',
  //   component: MineProfilePage,
  //   options: {
  //     title: '个人资料',
  //     headerShown: true,
  //   },
  // },
  // {
  //   name: 'MineSettings',
  //   component: MineSettingsPage,
  //   options: {
  //     title: '设置',
  //     headerShown: true,
  //   },
  // },
];

/**
 * Mine 模块默认导航选项
 */
export const mineDefaultOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'slide_from_right',
};
