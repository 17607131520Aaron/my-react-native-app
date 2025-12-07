/**
 * useScannerLifecycle - 扫描器生命周期管理 Hook
 * 监听应用状态和导航焦点，自动暂停/恢复扫描
 *
 * @module CodeScanner/useScannerLifecycle
 */

import { useIsFocused } from '@react-navigation/native';
import { useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';

import type { AppStateStatus } from 'react-native';

/**
 * useScannerLifecycle Hook 选项
 */
export interface IUseScannerLifecycleOptions {
  /** 外部暂停控制 */
  externalPaused?: boolean;
  /** 是否监听导航焦点 */
  watchNavigationFocus?: boolean;
}

/**
 * useScannerLifecycle Hook 返回值
 */
export interface IUseScannerLifecycleReturn {
  /** 综合判断是否应暂停 */
  shouldPause: boolean;
  /** App 是否在前台 */
  isAppActive: boolean;
  /** 页面是否有焦点 */
  isFocused: boolean;
}

/**
 * 扫描器生命周期管理 Hook
 *
 * 功能：
 * - 监听 AppState 变化
 * - 监听导航焦点变化
 * - 综合计算 shouldPause 状态
 *
 * @param options - Hook 选项
 * @returns 生命周期状态
 */
export function useScannerLifecycle(
  options?: IUseScannerLifecycleOptions,
): IUseScannerLifecycleReturn {
  const {
    externalPaused: isExternalPaused = false,
    watchNavigationFocus: shouldWatchNavigationFocus = true,
  } = options ?? {};

  const [isAppActive, setIsAppActive] = useState(AppState.currentState === 'active');

  // 使用 react-navigation 的 useIsFocused hook
  // 如果不监听导航焦点，默认为 true
  let isFocused = true;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    isFocused = shouldWatchNavigationFocus ? useIsFocused() : true;
  } catch {
    // 如果不在 NavigationContainer 中，默认为 true
    isFocused = true;
  }

  // 监听 AppState 变化
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus): void => {
      setIsAppActive(nextAppState === 'active');
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  // 计算综合暂停状态
  const shouldPause = useMemo(() => {
    return isExternalPaused || !isAppActive || !isFocused;
  }, [isExternalPaused, isAppActive, isFocused]);

  return useMemo(
    () => ({
      shouldPause,
      isAppActive,
      isFocused,
    }),
    [shouldPause, isAppActive, isFocused],
  );
}

/**
 * 简化版生命周期 Hook（不依赖 react-navigation）
 * 仅监听 AppState 变化
 */
export function useScannerLifecycleSimple(isExternalPaused = false): {
  shouldPause: boolean;
  isAppActive: boolean;
} {
  const [isAppActive, setIsAppActive] = useState(AppState.currentState === 'active');

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus): void => {
      setIsAppActive(nextAppState === 'active');
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  const shouldPause = isExternalPaused || !isAppActive;

  return useMemo(
    () => ({
      shouldPause,
      isAppActive,
    }),
    [shouldPause, isAppActive],
  );
}
