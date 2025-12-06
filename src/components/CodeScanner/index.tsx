/**
 * CodeScanner 模块
 * React Native 的综合条形码/二维码扫描组件
 *
 * @module CodeScanner
 */

// 主组件
export { CodeScanner, default } from './CodeScanner';

// UI 组件
export { ScanFrame } from './ScanFrame';

// 核心模块
export { ScanCache } from './ScanCache';
export { ScanThrottle } from './ScanThrottle';
export { ScanResultSerializer } from './ScanResultSerializer';

// Hooks
export { useCodeScanner } from './useCodeScanner';
export type { IUseCodeScannerOptions, IUseCodeScannerReturn } from './useCodeScanner';
export { useScannerLifecycle } from './useScannerLifecycle';
export type {
  IUseScannerLifecycleOptions,
  IUseScannerLifecycleReturn,
} from './useScannerLifecycle';

// 类型
export type {
  IScanResult,
  IScanCacheConfig,
  ICacheEntry,
  ISerializationResult,
  ICodeScannerProps,
} from './types';
