/**
 * useCodeScanner Hook
 * 集成 ScanCache 和 ScanThrottle 来管理扫码状态
 */

import { useCallback, useMemo, useRef, useState } from 'react';

import { ScanCache } from './ScanCache';
import { ScanThrottle } from './ScanThrottle';

import type { IScanCacheConfig, IScanResult } from './types';

export interface IUseCodeScannerOptions {
  /** 扫码时间间隔（毫秒），默认 1000 */
  scanInterval?: number;
  /** 缓存配置 */
  cacheConfig?: Partial<IScanCacheConfig>;
  /** 是否启用重复检测，默认 true */
  enableDuplicateDetection?: boolean;
}

export interface IUseCodeScannerReturn {
  /** 处理扫码结果 */
  handleScan: (value: string, codeType: string) => IScanResult | null;
  /** 检查是否为重复扫码 */
  isDuplicate: (value: string) => boolean;
  /** 清除缓存 */
  clearCache: () => void;
  /** 重置节流 */
  resetThrottle: () => void;
  /** 是否可以扫码 */
  canScan: boolean;
}

const DEFAULT_SCAN_INTERVAL = 1000;

/**
 * 管理扫码状态的 useCodeScanner hook
 * @param options - 配置选项
 * @returns 扫码管理函数和状态
 */
export function useCodeScanner(options?: IUseCodeScannerOptions): IUseCodeScannerReturn {
  const {
    scanInterval = DEFAULT_SCAN_INTERVAL,
    cacheConfig,
    enableDuplicateDetection: isDuplicateDetectionEnabled = true,
  } = options ?? {};

  // 使用 ref 在渲染之间保持稳定的实例
  const cacheRef = useRef<ScanCache>(new ScanCache(cacheConfig));
  const throttleRef = useRef<ScanThrottle>(new ScanThrottle(scanInterval));

  // 跟踪 canScan 状态以实现响应式
  const [canScanState, setCanScanState] = useState(true);

  /**
   * 检查一个值是否为重复扫码
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
   * 处理扫码事件
   * 如果扫码有效返回 ScanResult，如果被节流返回 null
   */
  const handleScan = useCallback(
    (value: string, codeType: string): IScanResult | null => {
      // 检查节流
      if (!throttleRef.current.canScan()) {
        return null;
      }

      // 创建扫码结果
      const result: IScanResult = {
        value,
        codeType,
        timestamp: Date.now(),
      };

      // 记录扫码并更新节流状态
      throttleRef.current.recordScan();
      setCanScanState(false);

      // 当节流过期时调度状态更新
      const remainingTime = throttleRef.current.getRemainingTime();
      if (remainingTime > 0) {
        setTimeout(() => {
          setCanScanState(throttleRef.current.canScan());
        }, remainingTime);
      }

      // 添加到缓存用于重复检测
      if (isDuplicateDetectionEnabled) {
        cacheRef.current.add(value);
      }

      return result;
    },
    [isDuplicateDetectionEnabled],
  );

  /**
   * 清除扫码缓存
   */
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  /**
   * 重置节流状态
   */
  const resetThrottle = useCallback(() => {
    throttleRef.current.reset();
    setCanScanState(true);
  }, []);

  /**
   * 当前 canScan 状态
   */
  const canScan = useMemo(() => canScanState, [canScanState]);

  return {
    handleScan,
    isDuplicate,
    clearCache,
    resetThrottle,
    canScan,
  };
}
