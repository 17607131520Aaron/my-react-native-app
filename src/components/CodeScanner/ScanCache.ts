/**
 * ScanCache - 用于存储已扫描码值的缓存
 * 实现 FIFO 驱逐和基于过期时间的失效
 */

import type { ICacheEntry, IScanCacheConfig } from './types';

/** 默认缓存配置 */
const DEFAULT_CONFIG: IScanCacheConfig = {
  maxSize: 100,
  expirationMs: 5 * 60 * 1000, // 5 分钟
};

/**
 * ScanCache 类用于管理已扫描的码值
 * 支持达到 maxSize 时的 FIFO 驱逐和基于时间的过期
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
    this.config = { ...DEFAULT_CONFIG, ...config };
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

    // 检查条目是否已过期
    const now = Date.now();
    if (now - entry.timestamp > this.config.expirationMs) {
      // 移除过期条目
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
    // 如果值已存在，更新其时间戳并移动到插入顺序的末尾
    if (this.cache.has(value)) {
      this.removeEntry(value);
    }

    // 如果达到最大容量，驱逐最旧的条目
    while (this.cache.size >= this.config.maxSize && this.insertionOrder.length > 0) {
      const oldestValue = this.insertionOrder[0];
      this.removeEntry(oldestValue);
    }

    // 添加新条目
    const entry: ICacheEntry = {
      value,
      timestamp: Date.now(),
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
