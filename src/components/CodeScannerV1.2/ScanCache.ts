/**
 * ScanCache - 扫码结果缓存管理类
 * 使用 FIFO 策略管理已扫描的码值，支持过期失效和重复提示间隔控制
 *
 * @module CodeScanner/ScanCache
 */

import { DEFAULT_CACHE_CONFIG } from './types';

import type { ICacheEntry, IScanCacheConfig } from './types';

/**
 * 扫码缓存管理类
 *
 * 功能：
 * - FIFO 缓存驱逐策略
 * - 基于时间的过期失效
 * - 重复提示间隔控制
 */
export class ScanCache {
  private config: IScanCacheConfig;
  private cache: Map<string, ICacheEntry>;
  private insertionOrder: string[];

  /**
   * 创建一个新的 ScanCache 实例
   * @param config - 可选的配置覆盖
   */
  constructor(config?: Partial<IScanCacheConfig>) {
    this.config = {
      ...DEFAULT_CACHE_CONFIG,
      ...config,
    };
    this.cache = new Map();
    this.insertionOrder = [];
  }

  /**
   * 检查一个值是否存在于缓存中且未过期
   * @param value - 要检查的码值
   * @returns 如果值存在且未过期返回 true，否则返回 false
   */
  has(value: string): boolean {
    const entry = this.cache.get(value);
    if (!entry) {
      return false;
    }

    // 检查是否过期
    const now = Date.now();
    if (now - entry.timestamp > this.config.expirationMs) {
      // 已过期，移除条目
      this.removeEntry(value);
      return false;
    }

    return true;
  }

  /**
   * 添加一个值到缓存
   * 如果缓存已达到最大容量，移除最旧的条目（FIFO）
   * @param value - 要添加的码值
   */
  add(value: string): void {
    const now = Date.now();

    // 如果已存在，更新时间戳
    const existingEntry = this.cache.get(value);
    if (existingEntry) {
      existingEntry.timestamp = now;
      return;
    }

    // 检查是否需要驱逐
    while (this.cache.size >= this.config.maxSize && this.insertionOrder.length > 0) {
      const oldestValue = this.insertionOrder[0];
      this.removeEntry(oldestValue);
    }

    // 添加新条目
    const entry: ICacheEntry = {
      value,
      timestamp: now,
    };
    this.cache.set(value, entry);
    this.insertionOrder.push(value);
  }

  /**
   * 清除缓存中的所有条目
   */
  clear(): void {
    this.cache.clear();
    this.insertionOrder = [];
  }

  /**
   * 获取缓存中当前的条目数量
   * @returns 缓存条目的数量
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * 获取缓存条目详情
   * @param value - 要获取的码值
   * @returns 缓存条目，如果不存在或已过期返回 undefined
   */
  getEntry(value: string): ICacheEntry | undefined {
    if (!this.has(value)) {
      return undefined;
    }
    return this.cache.get(value);
  }

  /**
   * 检查是否可以发送重复提示
   * @param value - 要检查的码值
   * @param interval - 重复提示间隔（毫秒）
   * @returns 如果可以发送提示返回 true，否则返回 false
   */
  canNotify(value: string, interval: number): boolean {
    const entry = this.cache.get(value);
    if (!entry) {
      return true; // 不在缓存中，可以提示
    }

    // 检查是否过期
    const now = Date.now();
    if (now - entry.timestamp > this.config.expirationMs) {
      this.removeEntry(value);
      return true; // 已过期，可以提示
    }

    // 检查上次提示时间
    if (!entry.lastNotificationTime) {
      return true; // 从未提示过，可以提示
    }

    return now - entry.lastNotificationTime >= interval;
  }

  /**
   * 更新上次提示时间
   * @param value - 要更新的码值
   */
  updateNotificationTime(value: string): void {
    const entry = this.cache.get(value);
    if (entry) {
      entry.lastNotificationTime = Date.now();
    }
  }

  /**
   * 从缓存中移除特定条目
   * @param value - 要移除的值
   */
  private removeEntry(value: string): void {
    this.cache.delete(value);
    const index = this.insertionOrder.indexOf(value);
    if (index > -1) {
      this.insertionOrder.splice(index, 1);
    }
  }
}
