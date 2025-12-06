/**
 * Mine 模块路由配置
 * 定义"我的"模块的所有路由页面
 */

import AboutPage from '~/pages/About';
import LoginPage from '~/pages/Login';
import MineHomePage from '~/pages/MineHome';

import type { IRouteConfig } from './types';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

/**
 * Mine 模块路由配置列表
 * 使用统一的 IRouteConfig 接口
 */
export const mineRoutes: IRouteConfig[] = [
  {
    name: 'MineHome',
    component: MineHomePage,
    options: {
      title: '我的',
      headerShown: false,
    },
    isTabHome: true, // 标记为 Tab 首页
  },
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
