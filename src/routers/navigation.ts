/**
 * 路由导航工具
 * 提供类型安全的跨模块路由跳转功能
 */

import { getRouteModule, type IAllRoutesParamList } from './index';

import type { NavigationProp } from '@react-navigation/native';
import type { IRootStackParamList } from './types';

/**
 * 导航器类型
 * 用于在组件中获取导航对象（根导航器）
 */
export type TRootNavigationProp = NavigationProp<IRootStackParamList>;

/**
 * 根据路由名称直接跳转
 * 自动判断路由所属模块，支持跨模块跳转
 *
 * @example
 * // 跳转到 Engineer 模块的 EngineerTaskDetail 页面
 * navigateTo(navigation, 'EngineerTaskDetail', { taskId: '123' });
 *
 * @example
 * // 跳转到 Institution 模块的 ScanInboundPage 页面
 * navigateTo(navigation, 'ScanInboundPage', { scanType: 'inbound' });
 *
 * @example
 * // 跳转到 Mine 模块的 About 页面
 * navigateTo(navigation, 'About');
 */
export function navigateTo<T extends keyof IAllRoutesParamList>(
  navigation: TRootNavigationProp,
  routeName: T,
  params?: IAllRoutesParamList[T],
): void {
  const module = getRouteModule(routeName);
  // 使用嵌套导航的方式跳转
  // @ts-expect-error - React Navigation 的类型系统限制
  navigation.navigate(module, {
    screen: routeName,
    params,
  });
}

/**
 * 使用 Hook 获取导航对象并返回导航函数
 * 可以在组件中这样使用：
 *
 * @example
 * const navigation = useNavigation<RootNavigationProp>();
 * const { navigateTo } = useNavigationHelper(navigation);
 * navigateTo('EngineerTaskDetail', { taskId: '123' });
 */
export function useNavigationHelper(navigation: TRootNavigationProp): {
  navigateTo: <T extends keyof IAllRoutesParamList>(
    routeName: T,
    params?: IAllRoutesParamList[T],
  ) => void;
} {
  return {
    /**
     * 根据路由名称跳转
     */
    navigateTo: <T extends keyof IAllRoutesParamList>(
      routeName: T,
      params?: IAllRoutesParamList[T],
    ) => {
      navigateTo(navigation, routeName, params);
    },
  };
}

// ==================== 兼容性别名 ====================
/**
 * 为了保持向后兼容，导出不带 T 前缀的别名
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export type RootNavigationProp = TRootNavigationProp;
