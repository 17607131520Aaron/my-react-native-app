/**
 * 缓存管理 Hook
 * 用于管理已扫描条码的缓存，防止短时间内重复处理同一条码
 */

import { useCallback, useRef } from 'react';

import { DEFAULT_CACHE_TIMEOUT } from '../constants';

import type { ICacheEntry, ICacheManagerReturn } from '../types';

interface IUseCacheManagerOptions {
  /** 缓存超时时间（毫秒） */
  timeout?: number;
  /** 是否启用缓存 */
  isEnabled?: boolean;
}

/**
 * 缓存管理 Hook
 * @param options 配置选项
 */
export function useCacheManager(options: IUseCacheManagerOptions = {}): ICacheManagerReturn {
  const { timeout = DEFAULT_CACHE_TIMEOUT, isEnabled = true } = options;

  // 使用 Map 存储缓存，key 为条码内容
  const cacheRef = useRef<Map<string, ICacheEntry>>(new Map());

  /**
   * 添加条码到缓存
   */
  const addToCache = useCallback(
    (code: string) => {
      if (!isEnabled || !code) {
        return;
      }

      const cache = cacheRef.current;

      // 如果已存在，先清除旧的定时器
      const existingEntry = cache.get(code);
      if (existingEntry) {
        clearTimeout(existingEntry.timerId);
      }

      // 设置超时自动清除
      const timerId = setTimeout(() => {
        cache.delete(code);
      }, timeout);

      // 添加到缓存
      cache.set(code, {
        code,
        timestamp: Date.now(),
        timerId,
      });
    },
    [isEnabled, timeout],
  );

  /**
   * 检查条码是否在缓存中
   */
  const isInCache = useCallback(
    (code: string): boolean => {
      if (!isEnabled || !code) {
        return false;
      }
      return cacheRef.current.has(code);
    },
    [isEnabled],
  );

  /**
   * 从缓存中移除指定条码
   */
  const removeFromCache = useCallback((code: string) => {
    const cache = cacheRef.current;
    const entry = cache.get(code);

    if (entry) {
      clearTimeout(entry.timerId);
      cache.delete(code);
    }
  }, []);

  /**
   * 清空所有缓存
   */
  const clearCache = useCallback(() => {
    const cache = cacheRef.current;

    // 清除所有定时器
    cache.forEach((entry) => {
      clearTimeout(entry.timerId);
    });

    // 清空缓存
    cache.clear();
  }, []);

  return {
    addToCache,
    isInCache,
    removeFromCache,
    clearCache,
  };
}

export default useCacheManager;
