/**
 * 路由导航工具
 * 提供类型安全的路由跳转功能
 */

import type { IAllRoutesParamList } from './types';
import type { NavigationProp } from '@react-navigation/native';

/**
 * 导航器类型
 */
export type TRootNavigationProp = NavigationProp<IAllRoutesParamList>;

/**
 * 路由跳转
 *
 * @example
 * navigateTo(navigation, 'ScanInboundPage', { scanType: 'inbound' });
 * navigateTo(navigation, 'About');
 */
export function navigateTo<T extends keyof IAllRoutesParamList>(
  navigation: TRootNavigationProp,
  routeName: T,
  params?: IAllRoutesParamList[T],
): void {
  // @ts-expect-error - React Navigation 类型限制
  navigation.navigate(routeName, params);
}

/**
 * 导航 Hook 封装
 *
 * @example
 * const { navigateTo } = useNavigationHelper(navigation);
 * navigateTo('ScanInboundPage', { scanType: 'inbound' });
 */
export function useNavigationHelper(navigation: TRootNavigationProp): {
  navigateTo: <T extends keyof IAllRoutesParamList>(
    routeName: T,
    params?: IAllRoutesParamList[T],
  ) => void;
} {
  return {
    navigateTo: <T extends keyof IAllRoutesParamList>(
      routeName: T,
      params?: IAllRoutesParamList[T],
    ) => {
      navigateTo(navigation, routeName, params);
    },
  };
}

// 兼容性别名
// eslint-disable-next-line @typescript-eslint/naming-convention
export type RootNavigationProp = TRootNavigationProp;
