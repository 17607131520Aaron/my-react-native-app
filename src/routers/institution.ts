/**
 * Institution 模块路由配置
 * 定义机构模块的所有路由页面
 */

import InstitutionHomePage from '~/pages/InstitutionHome';
import ScanInboundPage from '~/pages/ScanInboundPage';

import type { IRouteConfig } from './types';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

/**
 * Institution 模块路由配置列表
 * 使用统一的 IRouteConfig 接口
 */
export const institutionRoutes: IRouteConfig[] = [
  {
    name: 'InstitutionHome',
    component: InstitutionHomePage,
    options: {
      title: '机构',
      headerShown: false,
    },
    isTabHome: true, // 标记为 Tab 首页
  },
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
