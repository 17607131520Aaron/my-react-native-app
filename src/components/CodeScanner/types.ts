/**
 * CodeScanner Types
 * Core type definitions for the CodeScanner component
 */

import type { ViewStyle } from 'react-native';

/**
 * Represents the result of a successful scan
 * @property value - The scanned code value
 * @property codeType - The type of code (qr, ean13, code128, etc.)
 * @property timestamp - The timestamp when the scan occurred
 */
export interface IScanResult {
  /** 扫描到的码值 */
  value: string;
  /** 码类型 (qr, ean13, code128 等) */
  codeType: string;
  /** 扫描时间戳 */
  timestamp: number;
}

/**
 * Configuration options for the ScanCache
 * @property maxSize - Maximum number of entries in the cache (default: 100)
 * @property expirationMs - Time in milliseconds before a cache entry expires (default: 5 minutes)
 */
export interface IScanCacheConfig {
  /** 缓存最大容量，默认 100 */
  maxSize: number;
  /** 缓存过期时间（毫秒），默认 5 分钟 */
  expirationMs: number;
}

/**
 * Represents a single entry in the scan cache
 * @property value - The cached code value
 * @property timestamp - The timestamp when the entry was added to the cache
 */
export interface ICacheEntry {
  /** 缓存的码值 */
  value: string;
  /** 添加到缓存的时间戳 */
  timestamp: number;
}

/**
 * Result of a serialization/deserialization operation
 * @template T - The type of data being serialized/deserialized
 * @property success - Whether the operation was successful
 * @property data - The resulting data (only present if success is true)
 * @property error - Error message (only present if success is false)
 */
export interface ISerializationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Props for the CodeScanner component
 */
export interface ICodeScannerProps {
  /** 扫码成功回调 */
  onScan: (result: IScanResult) => void;
  /** 重复扫码回调 */
  onDuplicateScan?: (result: IScanResult) => void;
  /** 相机权限被拒绝回调 */
  onPermissionDenied?: () => void;
  /** 扫码时间间隔（毫秒），默认 1000 */
  scanInterval?: number;
  /** 是否启用重复检测，默认 true */
  enableDuplicateDetection?: boolean;
  /** 重复扫码时是否仍触发 onScan，默认 false */
  allowDuplicateScan?: boolean;
  /** 缓存配置 */
  cacheConfig?: Partial<IScanCacheConfig>;
  /** 是否暂停扫码，默认 false */
  paused?: boolean;
  /** 手电筒模式 */
  torchMode?: 'on' | 'off';
  /** 是否显示扫描框，默认 true */
  showScanFrame?: boolean;
  /** 扫描框样式 */
  scanFrameStyle?: ViewStyle;
  /** 容器样式 */
  style?: ViewStyle;
}
