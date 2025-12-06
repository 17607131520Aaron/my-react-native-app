/**
 * ScanCache - Cache for storing scanned code values
 * Implements FIFO eviction and expiration-based invalidation
 */

import type { ICacheEntry, IScanCacheConfig } from './types';

/** Default cache configuration */
const DEFAULT_CONFIG: IScanCacheConfig = {
  maxSize: 100,
  expirationMs: 5 * 60 * 1000, // 5 minutes
};

/**
 * ScanCache class for managing scanned code values
 * Supports FIFO eviction when maxSize is reached and time-based expiration
 */
export class ScanCache {
  private config: IScanCacheConfig;
  private cache: Map<string, ICacheEntry>;
  private insertionOrder: string[];

  /**
   * Creates a new ScanCache instance
   * @param config - Optional configuration overrides
   */
  constructor(config?: Partial<IScanCacheConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.cache = new Map();
    this.insertionOrder = [];
  }

  /**
   * Checks if a value exists in the cache and is not expired
   * @param value - The code value to check
   * @returns true if the value exists and is not expired, false otherwise
   */
  has(value: string): boolean {
    const entry = this.cache.get(value);
    if (!entry) {
      return false;
    }

    // Check if entry has expired
    const now = Date.now();
    if (now - entry.timestamp > this.config.expirationMs) {
      // Remove expired entry
      this.removeEntry(value);
      return false;
    }

    return true;
  }

  /**
   * Adds a value to the cache
   * If the cache is at max capacity, removes the oldest entry (FIFO)
   * @param value - The code value to add
   */
  add(value: string): void {
    // If value already exists, update its timestamp and move to end of insertion order
    if (this.cache.has(value)) {
      this.removeEntry(value);
    }

    // Evict oldest entry if at max capacity
    while (this.cache.size >= this.config.maxSize && this.insertionOrder.length > 0) {
      const oldestValue = this.insertionOrder[0];
      this.removeEntry(oldestValue);
    }

    // Add new entry
    const entry: ICacheEntry = {
      value,
      timestamp: Date.now(),
    };
    this.cache.set(value, entry);
    this.insertionOrder.push(value);
  }

  /**
   * Clears all entries from the cache
   */
  clear(): void {
    this.cache.clear();
    this.insertionOrder = [];
  }

  /**
   * Gets the current number of entries in the cache
   * @returns The number of cached entries
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Removes a specific entry from the cache
   * @param value - The value to remove
   */
  private removeEntry(value: string): void {
    this.cache.delete(value);
    const index = this.insertionOrder.indexOf(value);
    if (index > -1) {
      this.insertionOrder.splice(index, 1);
    }
  }
}
