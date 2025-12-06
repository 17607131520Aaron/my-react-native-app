/**
 * Engineer 模块路由配置
 * 定义工程师模块的所有路由页面
 */

import type { IEngineerStackParamList } from './types';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import type { ComponentType } from 'react';

// 导入页面组件（根据实际页面路径调整）
// import EngineerHomePage from '~/pages/Engineer/Home';
// import EngineerTaskListPage from '~/pages/Engineer/TaskList';
// import EngineerTaskDetailPage from '~/pages/Engineer/TaskDetail';
// import EngineerProfilePage from '~/pages/Engineer/Profile';

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
  //   name: 'EngineerHome',
  //   component: EngineerHomePage,
  //   options: {
  //     title: '工程师首页',
  //     headerShown: true,
  //   },
  // },
  // {
  //   name: 'EngineerTaskList',
  //   component: EngineerTaskListPage,
  //   options: {
  //     title: '任务列表',
  //     headerShown: true,
  //   },
  // },
  // {
  //   name: 'EngineerTaskDetail',
  //   component: EngineerTaskDetailPage,
  //   options: {
  //     title: '任务详情',
  //     headerShown: true,
  //   },
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
