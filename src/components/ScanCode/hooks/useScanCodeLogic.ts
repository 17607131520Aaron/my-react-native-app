/**
 * 扫码核心逻辑 Hook
 */

import { useCallback, useRef, useState } from 'react';
import { Vibration } from 'react-native';

import { DEFAULT_SCAN_INTERVAL, REVERSE_CODE_TYPE_MAP } from '../constants';
import { processResults } from '../utils/filterUtils';

import { useCacheManager } from './useCacheManager';

import type {
  IRawScanResult,
  IScanResult,
  IUseScanCodeLogicOptions,
  IUseScanCodeLogicReturn,
  TCodeType,
} from '../types';

/**
 * 扫码核心逻辑 Hook
 */
export function useScanCodeLogic(options: IUseScanCodeLogicOptions): IUseScanCodeLogicReturn {
  const {
    scanArea,
    shouldLimitArea,
    includePatterns,
    excludePatterns,
    isCacheEnabled,
    cacheTimeout,
    scanInterval,
    scanTimeout,
    isVibrationEnabled,
    onCodeScanned,
    onMultipleCodesScanned,
    onCachedCodeScanned,
    onScanTimeout,
  } = options;

  // ========== 状态 ==========
  const [isScanning, setIsScanning] = useState(true);
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);

  // ========== Refs ==========
  const isMountedRef = useRef(true);
  const scanIntervalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scanTimeoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScanTimeRef = useRef<number>(0);

  // ========== 缓存管理 ==========
  const { addToCache, isInCache, removeFromCache, clearCache } = useCacheManager({
    timeout: cacheTimeout,
    isEnabled: isCacheEnabled,
  });

  // ========== 扫码超时处理 ==========
  const startScanTimeout = useCallback(() => {
    if (!scanTimeout || !onScanTimeout) {
      return;
    }

    // 清除之前的超时定时器
    if (scanTimeoutTimerRef.current) {
      clearTimeout(scanTimeoutTimerRef.current);
    }

    scanTimeoutTimerRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        onScanTimeout();
      }
    }, scanTimeout);
  }, [scanTimeout, onScanTimeout]);

  const clearScanTimeout = useCallback(() => {
    if (scanTimeoutTimerRef.current) {
      clearTimeout(scanTimeoutTimerRef.current);
      scanTimeoutTimerRef.current = null;
    }
  }, []);

  // ========== 转换原始结果为标准结果 ==========
  const convertToScanResult = useCallback((raw: IRawScanResult): IScanResult => {
    const codeType = REVERSE_CODE_TYPE_MAP[raw.codeFormat] || ('qr' as TCodeType);

    return {
      data: raw.codeStringValue,
      type: codeType,
      timestamp: Date.now(),
      bounds: raw.bounds
        ? {
            top: raw.bounds.origin.y,
            left: raw.bounds.origin.x,
            width: raw.bounds.size.width,
            height: raw.bounds.size.height,
          }
        : undefined,
    };
  }, []);

  // ========== 处理扫码结果 ==========
  const handleCodeRead = useCallback(
    (codes: IRawScanResult[]) => {
      // 检查是否可以扫码
      if (!isScanning || !isMountedRef.current) {
        return;
      }

      // 检查扫码间隔
      const now = Date.now();
      if (now - lastScanTimeRef.current < (scanInterval || DEFAULT_SCAN_INTERVAL)) {
        return;
      }

      // 过滤和排序结果
      const processedResults = processResults(codes, {
        scanArea,
        shouldLimitArea,
        excludePatterns,
        includePatterns,
      });

      if (processedResults.length === 0) {
        return;
      }

      // 获取第一个结果
      const firstResult = processedResults[0];
      const codeData = firstResult.codeStringValue;

      // 检查缓存
      if (isCacheEnabled && isInCache(codeData)) {
        // 缓存命中，调用缓存回调
        const scanResult = convertToScanResult(firstResult);
        onCachedCodeScanned?.(scanResult);
        return;
      }

      // 更新最后扫码时间
      lastScanTimeRef.current = now;

      // 清除扫码超时定时器
      clearScanTimeout();

      // 添加到缓存
      if (isCacheEnabled) {
        addToCache(codeData);
      }

      // 触发震动
      if (isVibrationEnabled) {
        Vibration.vibrate();
      }

      // 暂停扫码（扫码间隔控制）
      setIsScanning(false);
      scanIntervalTimerRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          setIsScanning(true);
          // 重新启动扫码超时
          startScanTimeout();
        }
      }, scanInterval || DEFAULT_SCAN_INTERVAL);

      // 转换结果
      const scanResult = convertToScanResult(firstResult);

      // 调用回调
      onCodeScanned?.(scanResult);

      // 如果有多个结果，调用多码回调
      if (processedResults.length > 1 && onMultipleCodesScanned) {
        const allResults = processedResults.map(convertToScanResult);
        onMultipleCodesScanned(allResults);
      }
    },
    [
      isScanning,
      scanInterval,
      scanArea,
      shouldLimitArea,
      excludePatterns,
      includePatterns,
      isCacheEnabled,
      isInCache,
      addToCache,
      isVibrationEnabled,
      convertToScanResult,
      onCodeScanned,
      onMultipleCodesScanned,
      onCachedCodeScanned,
      clearScanTimeout,
      startScanTimeout,
    ],
  );

  // ========== 暂停扫码 ==========
  const pauseScanning = useCallback(() => {
    setIsScanning(false);
    clearScanTimeout();
  }, [clearScanTimeout]);

  // ========== 恢复扫码 ==========
  const resumeScanning = useCallback(() => {
    setIsScanning(true);
    startScanTimeout();
  }, [startScanTimeout]);

  // ========== 切换闪光灯 ==========
  const toggleFlashlight = useCallback(() => {
    setIsFlashlightOn((prev) => !prev);
  }, []);

  // ========== 清理资源 ==========
  const cleanup = useCallback(() => {
    isMountedRef.current = false;

    // 清除扫码间隔定时器
    if (scanIntervalTimerRef.current) {
      clearTimeout(scanIntervalTimerRef.current);
      scanIntervalTimerRef.current = null;
    }

    // 清除扫码超时定时器
    clearScanTimeout();

    // 清空缓存
    clearCache();

    // 关闭闪光灯
    setIsFlashlightOn(false);
  }, [clearScanTimeout, clearCache]);

  return {
    isScanning,
    isFlashlightOn,
    handleCodeRead,
    pauseScanning,
    resumeScanning,
    toggleFlashlight,
    clearCache,
    removeFromCache,
    cleanup,
  };
}

export default useScanCodeLogic;
