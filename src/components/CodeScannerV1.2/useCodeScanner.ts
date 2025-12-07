/**
 * useCodeScanner - 扫码状态管理 Hook
 * 集成缓存、节流、震动反馈等功能
 *
 * @module CodeScanner/useCodeScanner
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { HapticFeedback } from './HapticFeedback';
import { ScanCache } from './ScanCache';
import { ScanThrottle } from './ScanThrottle';
import {
  DEFAULT_DUPLICATE_NOTIFICATION_INTERVAL,
  DEFAULT_QUICK_SCAN_CONFIG,
  DEFAULT_SCAN_INTERVAL,
} from './types';

import type { IScanCacheConfig, IScanResult, IVibrationConfig } from './types';

/**
 * useCodeScanner Hook 选项
 */
export interface IUseCodeScannerOptions {
  /** 扫码间隔（毫秒） */
  scanInterval?: number;
  /** 启用重复检测 */
  enableDuplicateDetection?: boolean;
  /** 重复提示间隔（毫秒） */
  duplicateNotificationInterval?: number;
  /** 缓存配置 */
  cacheConfig?: Partial<IScanCacheConfig>;
  /** 启用震动反馈 */
  enableVibration?: boolean;
  /** 震动配置 */
  vibrationConfig?: Partial<IVibrationConfig>;
  /** 快速扫码模式 */
  quickScanMode?: boolean;
}

/**
 * useCodeScanner Hook 返回值
 */
export interface IUseCodeScannerReturn {
  /** 处理扫码结果 */
  handleScan: (value: string, codeType: string) => IScanResult | null;
  /** 检查是否重复 */
  isDuplicate: (value: string) => boolean;
  /** 检查是否可以发送重复提示 */
  canNotifyDuplicate: (value: string) => boolean;
  /** 更新重复提示时间 */
  updateDuplicateNotification: (value: string) => void;
  /** 清除缓存 */
  clearCache: () => void;
  /** 重置节流 */
  resetThrottle: () => void;
  /** 当前是否可扫码 */
  canScan: boolean;
  /** 触发成功震动 */
  triggerSuccessVibration: () => void;
  /** 触发重复震动 */
  triggerDuplicateVibration: () => void;
  /** 触发错误震动 */
  triggerErrorVibration: () => void;
  /** 设置扫码间隔 */
  setScanInterval: (interval: number) => void;
  /** 设置震动启用状态 */
  setVibrationEnabled: (enabled: boolean) => void;
}

/**
 * 扫码状态管理 Hook
 *
 * 功能：
 * - 集成 ScanCache 和 ScanThrottle
 * - 处理扫码结果
 * - 管理震动反馈
 * - 支持快速扫码模式
 *
 * @param options - Hook 选项
 * @returns 扫码状态和控制方法
 */
export function useCodeScanner(options?: IUseCodeScannerOptions): IUseCodeScannerReturn {
  const {
    scanInterval = DEFAULT_SCAN_INTERVAL,
    enableDuplicateDetection: isDuplicateDetectionEnabled = true,
    duplicateNotificationInterval = DEFAULT_DUPLICATE_NOTIFICATION_INTERVAL,
    cacheConfig,
    enableVibration: isVibrationEnabled = true,
    vibrationConfig,
    quickScanMode: isQuickScanMode = false,
  } = options ?? {};

  // 计算实际扫码间隔
  const actualScanInterval = isQuickScanMode
    ? DEFAULT_QUICK_SCAN_CONFIG.scanInterval ?? 200
    : scanInterval;

  // 创建实例引用
  const cacheRef = useRef<ScanCache>(new ScanCache(cacheConfig));
  const throttleRef = useRef<ScanThrottle>(new ScanThrottle(actualScanInterval));
  const hapticRef = useRef<HapticFeedback>(new HapticFeedback(vibrationConfig));

  // 响应式状态
  const [canScan, setCanScan] = useState(true);

  // 更新节流间隔
  useEffect(() => {
    throttleRef.current.setInterval(actualScanInterval);
  }, [actualScanInterval]);

  // 更新震动启用状态
  useEffect(() => {
    hapticRef.current.setEnabled(isVibrationEnabled);
  }, [isVibrationEnabled]);

  // 更新震动配置
  useEffect(() => {
    if (vibrationConfig) {
      hapticRef.current.updateConfig(vibrationConfig);
    }
  }, [vibrationConfig]);

  // 快速扫码模式下更新震动模式
  useEffect(() => {
    if (isQuickScanMode) {
      hapticRef.current.updateConfig({
        successPattern: DEFAULT_QUICK_SCAN_CONFIG.vibrationPattern,
      });
    }
  }, [isQuickScanMode]);

  /**
   * 检查是否重复
   */
  const isDuplicate = useCallback(
    (value: string): boolean => {
      if (!isDuplicateDetectionEnabled) {
        return false;
      }
      return cacheRef.current.has(value);
    },
    [isDuplicateDetectionEnabled],
  );

  /**
   * 检查是否可以发送重复提示
   */
  const canNotifyDuplicate = useCallback(
    (value: string): boolean => {
      return cacheRef.current.canNotify(value, duplicateNotificationInterval);
    },
    [duplicateNotificationInterval],
  );

  /**
   * 更新重复提示时间
   */
  const updateDuplicateNotification = useCallback((value: string): void => {
    cacheRef.current.updateNotificationTime(value);
  }, []);

  /**
   * 处理扫码结果
   */
  const handleScan = useCallback(
    (value: string, codeType: string): IScanResult | null => {
      // 检查节流
      if (!throttleRef.current.canScan()) {
        return null;
      }

      // 记录扫码
      throttleRef.current.recordScan();
      setCanScan(false);

      // 设置定时器恢复 canScan 状态
      setTimeout(() => {
        setCanScan(throttleRef.current.canScan());
      }, actualScanInterval);

      // 创建扫码结果
      const result: IScanResult = {
        value,
        codeType,
        timestamp: Date.now(),
      };

      // 添加到缓存（如果启用重复检测）
      if (isDuplicateDetectionEnabled) {
        cacheRef.current.add(value);
      }

      return result;
    },
    [isDuplicateDetectionEnabled, actualScanInterval],
  );

  /**
   * 清除缓存
   */
  const clearCache = useCallback((): void => {
    cacheRef.current.clear();
  }, []);

  /**
   * 重置节流
   */
  const resetThrottle = useCallback((): void => {
    throttleRef.current.reset();
    setCanScan(true);
  }, []);

  /**
   * 触发成功震动
   */
  const triggerSuccessVibration = useCallback((): void => {
    hapticRef.current.triggerSuccess();
  }, []);

  /**
   * 触发重复震动
   */
  const triggerDuplicateVibration = useCallback((): void => {
    hapticRef.current.triggerDuplicate();
  }, []);

  /**
   * 触发错误震动
   */
  const triggerErrorVibration = useCallback((): void => {
    hapticRef.current.triggerError();
  }, []);

  /**
   * 设置扫码间隔
   */
  const setScanInterval = useCallback((interval: number): void => {
    throttleRef.current.setInterval(interval);
  }, []);

  /**
   * 设置震动启用状态
   */
  const setVibrationEnabled = useCallback((enabled: boolean): void => {
    hapticRef.current.setEnabled(enabled);
  }, []);

  return useMemo(
    () => ({
      handleScan,
      isDuplicate,
      canNotifyDuplicate,
      updateDuplicateNotification,
      clearCache,
      resetThrottle,
      canScan,
      triggerSuccessVibration,
      triggerDuplicateVibration,
      triggerErrorVibration,
      setScanInterval,
      setVibrationEnabled,
    }),
    [
      handleScan,
      isDuplicate,
      canNotifyDuplicate,
      updateDuplicateNotification,
      clearCache,
      resetThrottle,
      canScan,
      triggerSuccessVibration,
      triggerDuplicateVibration,
      triggerErrorVibration,
      setScanInterval,
      setVibrationEnabled,
    ],
  );
}
