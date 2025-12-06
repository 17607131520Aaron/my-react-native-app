/**
 * CodeScanner Module
 * A comprehensive barcode/QR code scanner component for React Native
 *
 * @module CodeScanner
 */

// Main component
export { CodeScanner, default } from './CodeScanner';

// UI Components
export { ScanFrame } from './ScanFrame';

// Core modules
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

// Types
export type {
  IScanResult,
  IScanCacheConfig,
  ICacheEntry,
  ISerializationResult,
  ICodeScannerProps,
} from './types';
