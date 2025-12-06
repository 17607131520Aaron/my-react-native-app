/**
 * 路由导航工具
 * 提供类型安全的路由跳转功能
 */

import { createNavigationContainerRef } from '@react-navigation/native';

import type { IAllRoutesParamList } from './types';
import type { NavigationProp } from '@react-navigation/native';

/**
 * 导航器类型
 */
export type TRootNavigationProp = NavigationProp<IAllRoutesParamList>;

/**
 * 全局导航引用，支持在组件外部进行导航
 */
export const navigationRef = createNavigationContainerRef<IAllRoutesParamList>();

/**
 * 类型安全的导航函数（使用全局 navigationRef）
 *
 * @example
 * navigateTo('ScanInboundPage', { scanType: 'inbound' });
 * navigateTo('About');
 */
export function navigateTo<T extends keyof IAllRoutesParamList>(
  routeName: T,
  params?: IAllRoutesParamList[T],
): void {
  if (navigationRef.isReady()) {
    // @ts-expect-error - React Navigation 类型限制
    navigationRef.navigate(routeName, params);
  }
}

/**
 * 返回上一页
 */
export function goBack(): void {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

/**
 * 重置导航栈到指定页面
 */
export function resetTo<T extends keyof IAllRoutesParamList>(
  routeName: T,
  params?: IAllRoutesParamList[T],
): void {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: routeName as string, params }],
    });
  }
}

/**
 * 导航 Hook 封装（向后兼容，使用全局 navigationRef）
 *
 * @example
 * const { navigateTo } = useNavigationHelper();
 * navigateTo('ScanInboundPage', { scanType: 'inbound' });
 */
export function useNavigationHelper(): {
  navigateTo: <T extends keyof IAllRoutesParamList>(
    routeName: T,
    params?: IAllRoutesParamList[T],
  ) => void;
  goBack: () => void;
  resetTo: <T extends keyof IAllRoutesParamList>(
    routeName: T,
    params?: IAllRoutesParamList[T],
  ) => void;
} {
  return {
    navigateTo,
    goBack,
    resetTo,
  };
}

// 兼容性别名
// eslint-disable-next-line @typescript-eslint/naming-convention
export type RootNavigationProp = TRootNavigationProp;
