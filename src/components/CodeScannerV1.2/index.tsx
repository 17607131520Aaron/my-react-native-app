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
export type { IScanFrameProps } from './ScanFrame';
export { RecognitionFrame } from './RecognitionFrame';

// 核心模块
export { ScanCache } from './ScanCache';
export { ScanThrottle } from './ScanThrottle';
export { ScanResultSerializer, isValidScanResult } from './ScanResultSerializer';
export { HapticFeedback } from './HapticFeedback';

// Hooks
export { useCodeScanner } from './useCodeScanner';
export type { IUseCodeScannerOptions, IUseCodeScannerReturn } from './useCodeScanner';
export { useScannerLifecycle, useScannerLifecycleSimple } from './useScannerLifecycle';
export type {
  IUseScannerLifecycleOptions,
  IUseScannerLifecycleReturn,
} from './useScannerLifecycle';
export { useRecognitionFrame } from './useRecognitionFrame';
export type {
  IUseRecognitionFrameOptions,
  IUseRecognitionFrameReturn,
} from './useRecognitionFrame';

// 类型
export type {
  // 扫码结果
  IScanResult,
  ISerializationResult,
  // 缓存
  IScanCacheConfig,
  ICacheEntry,
  // 错误
  IScanError,
  TScanErrorType,
  // 震动
  IVibrationConfig,
  // 快速扫码
  IQuickScanConfig,
  // 识别框
  IBarcodeRect,
  IRecognitionFrameProps,
  // 主组件
  ICodeScannerProps,
  TRecognitionFrameType,
} from './types';

// 默认配置常量
export {
  DEFAULT_CACHE_CONFIG,
  DEFAULT_VIBRATION_CONFIG,
  DEFAULT_QUICK_SCAN_CONFIG,
  DEFAULT_SCAN_INTERVAL,
  DEFAULT_RECOGNITION_FRAME_DURATION,
  DEFAULT_DUPLICATE_NOTIFICATION_INTERVAL,
} from './types';
