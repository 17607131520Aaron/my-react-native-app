/**
 * Institution 模块路由配置
 * 定义机构模块的所有路由页面
 */

import ScanInboundPage from '~/pages/ScanInboundPage';

import type { IInstitutionStackParamList } from './types';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import type { ComponentType } from 'react';

/**
 * 路由配置项
 */
export interface IInstitutionRouteConfig {
  name: keyof IInstitutionStackParamList;
  component: ComponentType<unknown>;
  options?: NativeStackNavigationOptions;
}

/**
 * Institution 模块路由配置列表
 * 在这里添加该模块的所有路由页面
 */
export const institutionRoutes: IInstitutionRouteConfig[] = [
  {
    name: 'ScanInboundPage',
    component: ScanInboundPage,
    options: {
      title: '扫码入库',
      headerShown: true,
    },
  },
];

/**
 * Institution 模块默认导航选项
 */
export const institutionDefaultOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'slide_from_right',
};
