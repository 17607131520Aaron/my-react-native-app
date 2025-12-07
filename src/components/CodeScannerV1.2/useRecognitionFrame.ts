/**
 * useRecognitionFrame - 识别框管理 Hook
 * 管理识别框的显示状态和自动隐藏逻辑
 *
 * @module CodeScanner/useRecognitionFrame
 */

import { useCallback, useRef, useState } from 'react';

import { DEFAULT_RECOGNITION_FRAME_DURATION } from './types';

import type { IBarcodeRect, TRecognitionFrameType } from './types';

/**
 * useRecognitionFrame Hook 选项
 */
export interface IUseRecognitionFrameOptions {
  /** 默认显示时长（毫秒） */
  defaultDuration?: number;
}

/**
 * useRecognitionFrame Hook 返回值
 */
export interface IUseRecognitionFrameReturn {
  /** 识别框是否可见 */
  isFrameVisible: boolean;
  /** 识别框类型 */
  frameType: TRecognitionFrameType;
  /** 识别框位置 */
  frameBounds: IBarcodeRect | null;
  /** 当前显示时长 */
  frameDuration: number;
  /** 显示识别框 */
  showFrame: (type: TRecognitionFrameType, bounds?: IBarcodeRect, duration?: number) => void;
  /** 隐藏识别框 */
  hideFrame: () => void;
}

/**
 * 识别框管理 Hook
 *
 * 功能：
 * - 管理识别框显示/隐藏状态
 * - 支持自定义显示时长
 * - 支持位置定位
 *
 * @param options - Hook 选项
 * @returns 识别框状态和控制方法
 */
export function useRecognitionFrame(
  options?: IUseRecognitionFrameOptions,
): IUseRecognitionFrameReturn {
  const defaultDuration = options?.defaultDuration ?? DEFAULT_RECOGNITION_FRAME_DURATION;

  const [isVisible, setIsVisible] = useState(false);
  const [frameType, setFrameType] = useState<TRecognitionFrameType>('new');
  const [frameBounds, setFrameBounds] = useState<IBarcodeRect | null>(null);
  const [frameDuration, setFrameDuration] = useState(defaultDuration);

  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * 显示识别框
   * @param type - 识别框类型
   * @param bounds - 条码位置
   * @param duration - 显示时长
   */
  const showFrame = useCallback(
    (type: TRecognitionFrameType, bounds?: IBarcodeRect, duration?: number) => {
      // 清除之前的定时器
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }

      const actualDuration = duration ?? defaultDuration;

      setFrameType(type);
      setFrameBounds(bounds ?? null);
      setFrameDuration(actualDuration);
      setIsVisible(true);

      // 设置自动隐藏定时器
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        hideTimeoutRef.current = null;
      }, actualDuration);
    },
    [defaultDuration],
  );

  /**
   * 隐藏识别框
   */
  const hideFrame = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIsVisible(false);
  }, []);

  return {
    isFrameVisible: isVisible,
    frameType,
    frameBounds,
    frameDuration,
    showFrame,
    hideFrame,
  };
}
