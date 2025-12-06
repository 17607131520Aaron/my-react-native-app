/**
 * Engineer 模块路由配置
 * 定义工程师模块的所有路由页面
 */

import type { IRouteConfig } from './types';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

// TODO: Import EngineerHome page when available
// import EngineerHomePage from '~/pages/EngineerHome';

/**
 * Engineer 模块路由配置列表
 * 使用统一的 IRouteConfig 接口
 */
export const engineerRoutes: IRouteConfig[] = [
  // EngineerHome 标记为 Tab 首页，不注册到 Root Stack
  // {
  //   name: 'EngineerHome',
  //   component: EngineerHomePage,
  //   options: {
  //     title: '工作台',
  //     headerShown: false,
  //   },
  //   isTabHome: true,
  // },
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
