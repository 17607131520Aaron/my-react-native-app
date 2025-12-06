/**
 * useScannerLifecycle Hook
 * Manages scanner lifecycle based on app state and navigation focus
 */

import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';

import type { AppStateStatus } from 'react-native';

export interface IUseScannerLifecycleOptions {
  /** 是否启用 App 状态监听，默认 true */
  enableAppStateListener?: boolean;
  /** 是否启用导航焦点监听，默认 true */
  enableFocusListener?: boolean;
  /** 外部暂停状态（用户手动控制） */
  externalPaused?: boolean;
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
 * Hook to manage scanner lifecycle based on app state and navigation focus
 * @param options - Configuration options
 * @returns Lifecycle state and computed shouldPause value
 */
export function useScannerLifecycle(
  options?: IUseScannerLifecycleOptions,
): IUseScannerLifecycleReturn {
  const {
    enableAppStateListener = true,
    enableFocusListener = true,
    externalPaused = false,
  } = options ?? {};

  // Track app active state
  const [isAppActive, setIsAppActive] = useState<boolean>(AppState.currentState === 'active');

  // Track navigation focus state
  const [isFocused, setIsFocused] = useState<boolean>(true);

  // Handle AppState changes
  useEffect(() => {
    if (!enableAppStateListener) {
      setIsAppActive(true);
      return;
    }

    const handleAppStateChange = (nextAppState: AppStateStatus): void => {
      setIsAppActive(nextAppState === 'active');
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [enableAppStateListener]);

  // Handle navigation focus changes
  useFocusEffect(
    useCallback(() => {
      if (!enableFocusListener) {
        setIsFocused(true);
        return;
      }

      // Screen is focused
      setIsFocused(true);

      return () => {
        // Screen is unfocused
        setIsFocused(false);
      };
    }, [enableFocusListener]),
  );

  // Compute shouldPause based on all factors
  const shouldPause = externalPaused || !isAppActive || !isFocused;

  return {
    shouldPause,
    isAppActive,
    isFocused,
  };
}
