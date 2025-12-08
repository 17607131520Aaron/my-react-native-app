/**
 * 生命周期管理 Hook
 * 管理扫码组件的生命周期，包括页面焦点、应用状态和 isActive 属性
 */

import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import type { AppStateStatus } from 'react-native';

interface IUseLifecycleManagerOptions {
  /** 控制组件是否激活 */
  isActive?: boolean;
  /** 页面失焦时是否暂停 */
  shouldPauseOnBlur?: boolean;
  /** 应用进入后台时是否暂停 */
  shouldPauseOnBackground?: boolean;
  /** 暂停扫码回调 */
  onPause?: () => void;
  /** 恢复扫码回调 */
  onResume?: () => void;
  /** 关闭闪光灯回调 */
  onTurnOffFlashlight?: () => void;
}

interface IUseLifecycleManagerReturn {
  /** 相机是否应该激活 */
  isCameraActive: boolean;
  /** 当前应用状态 */
  appState: AppStateStatus;
}

/**
 * 生命周期管理 Hook
 */
export function useLifecycleManager(
  options: IUseLifecycleManagerOptions,
): IUseLifecycleManagerReturn {
  const {
    isActive = true,
    shouldPauseOnBlur = true,
    shouldPauseOnBackground = true,
    onPause,
    onResume,
    onTurnOffFlashlight,
  } = options;

  // ========== 状态 ==========
  const [isFocused, setIsFocused] = useState(true);
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  // ========== Refs ==========
  const isMountedRef = useRef(true);
  const wasActiveBeforeBlurRef = useRef(true);
  const wasActiveBeforeBackgroundRef = useRef(true);

  // ========== 计算相机是否应该激活 ==========
  const isCameraActive =
    isActive &&
    (!shouldPauseOnBlur || isFocused) &&
    (!shouldPauseOnBackground || appState === 'active');

  // ========== 页面焦点监听 ==========
  useFocusEffect(
    useCallback(() => {
      // 页面获得焦点
      if (isMountedRef.current) {
        setIsFocused(true);

        // 如果之前是激活状态，恢复扫码
        if (shouldPauseOnBlur && wasActiveBeforeBlurRef.current) {
          onResume?.();
        }
      }

      // 页面失去焦点
      return () => {
        if (isMountedRef.current) {
          setIsFocused(false);

          // 记录当前状态并暂停扫码
          if (shouldPauseOnBlur) {
            wasActiveBeforeBlurRef.current = isActive;
            onPause?.();
          }
        }
      };
    }, [isActive, shouldPauseOnBlur, onPause, onResume]),
  );

  // ========== 应用状态监听 ==========
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus): void => {
      if (!isMountedRef.current) {
        return;
      }

      const prevAppState = appState;

      // 应用进入后台
      if (prevAppState === 'active' && nextAppState.match(/inactive|background/)) {
        if (shouldPauseOnBackground) {
          wasActiveBeforeBackgroundRef.current = isActive;
          onPause?.();
          onTurnOffFlashlight?.();
        }
      }

      // 应用返回前台
      if (prevAppState.match(/inactive|background/) && nextAppState === 'active') {
        if (shouldPauseOnBackground && wasActiveBeforeBackgroundRef.current) {
          onResume?.();
        }
      }

      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [appState, isActive, shouldPauseOnBackground, onPause, onResume, onTurnOffFlashlight]);

  // ========== isActive 属性变化监听 ==========
  useEffect(() => {
    if (!isMountedRef.current) {
      return;
    }

    if (isActive) {
      onResume?.();
    } else {
      onPause?.();
    }
  }, [isActive, onPause, onResume]);

  // ========== 组件卸载清理 ==========
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    isCameraActive,
    appState,
  };
}

export default useLifecycleManager;
