/**
 * useCodeScanner Hook
 * Integrates ScanCache and ScanThrottle for managing scan state
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
 * useCodeScanner hook for managing scan state
 * @param options - Configuration options
 * @returns Scan management functions and state
 */
export function useCodeScanner(options?: IUseCodeScannerOptions): IUseCodeScannerReturn {
  const {
    scanInterval = DEFAULT_SCAN_INTERVAL,
    cacheConfig,
    enableDuplicateDetection: isDuplicateDetectionEnabled = true,
  } = options ?? {};

  // Use refs to maintain stable instances across renders
  const cacheRef = useRef<ScanCache>(new ScanCache(cacheConfig));
  const throttleRef = useRef<ScanThrottle>(new ScanThrottle(scanInterval));

  // Track canScan state for reactivity
  const [canScanState, setCanScanState] = useState(true);

  /**
   * Check if a value is a duplicate scan
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
   * Handle a scan event
   * Returns ScanResult if scan is valid, null if throttled
   */
  const handleScan = useCallback(
    (value: string, codeType: string): IScanResult | null => {
      // Check throttle
      if (!throttleRef.current.canScan()) {
        return null;
      }

      // Create scan result
      const result: IScanResult = {
        value,
        codeType,
        timestamp: Date.now(),
      };

      // Record scan and update throttle state
      throttleRef.current.recordScan();
      setCanScanState(false);

      // Schedule state update when throttle expires
      const remainingTime = throttleRef.current.getRemainingTime();
      if (remainingTime > 0) {
        setTimeout(() => {
          setCanScanState(throttleRef.current.canScan());
        }, remainingTime);
      }

      // Add to cache for duplicate detection
      if (isDuplicateDetectionEnabled) {
        cacheRef.current.add(value);
      }

      return result;
    },
    [isDuplicateDetectionEnabled],
  );

  /**
   * Clear the scan cache
   */
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  /**
   * Reset the throttle state
   */
  const resetThrottle = useCallback(() => {
    throttleRef.current.reset();
    setCanScanState(true);
  }, []);

  /**
   * Current canScan state
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
