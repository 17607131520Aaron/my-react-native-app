/**
 * useScannerLifecycle Hook
 * 管理扫码器生命周期，基于 App 状态和导航焦点
 */

import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';

import type { AppStateStatus } from 'react-native';

export interface IUseScannerLifecycleOptions {
  /** 是否启用 App 状态监听，默认 true */
  isAppStateListenerEnabled?: boolean;
  /** 是否启用导航焦点监听，默认 true */
  isFocusListenerEnabled?: boolean;
  /** 外部暂停状态（用户手动控制） */
  isExternalPaused?: boolean;
}

export interface IUseScannerLifecycleReturn {
  /** 是否应该暂停扫码（综合 App 状态、导航焦点、外部暂停） */
  shouldPause: boolean;
  /** 当前 App 是否在前台 */
  isAppActive: boolean;
  /** 当前页面是否有焦点 */
  isFocused: boolean;
}

/**
 * 管理扫码器生命周期的 Hook
 * @param options - 配置选项
 * @returns 生命周期状态和计算后的 shouldPause 值
 */
export function useScannerLifecycle(
  options?: IUseScannerLifecycleOptions,
): IUseScannerLifecycleReturn {
  const {
    isAppStateListenerEnabled = true,
    isFocusListenerEnabled = true,
    isExternalPaused = false,
  } = options ?? {};

  // 跟踪 App 是否在前台
  const [isAppActive, setIsAppActive] = useState<boolean>(() => {
    // 如果禁用监听，默认为 true
    if (!isAppStateListenerEnabled) {
      return true;
    }
    return AppState.currentState === 'active';
  });

  // 跟踪页面是否有焦点
  const [isFocused, setIsFocused] = useState<boolean>(true);

  // 处理 App 状态变化
  useEffect(() => {
    if (!isAppStateListenerEnabled) {
      return;
    }

    const handleAppStateChange = (nextAppState: AppStateStatus): void => {
      setIsAppActive(nextAppState === 'active');
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [isAppStateListenerEnabled]);

  // 处理导航焦点变化
  useFocusEffect(
    useCallback(() => {
      if (!isFocusListenerEnabled) {
        return;
      }

      // 页面获得焦点
      setIsFocused(true);

      return () => {
        // 页面失去焦点
        setIsFocused(false);
      };
    }, [isFocusListenerEnabled]),
  );

  // 综合计算是否应该暂停扫码
  const shouldPause = isExternalPaused || !isAppActive || !isFocused;

  return {
    shouldPause,
    isAppActive,
    isFocused,
  };
}
