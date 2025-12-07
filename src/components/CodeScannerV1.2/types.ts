/**
 * CodeScanner 类型定义
 * @module CodeScanner/types
 */

import type { ViewStyle } from 'react-native';

// ============================================================================
// 扫码结果相关类型
// ============================================================================

/**
 * 扫码结果接口
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
 * 序列化结果接口
 */
export interface ISerializationResult<T> {
  /** 操作是否成功 */
  success: boolean;
  /** 成功时的数据 */
  data?: T;
  /** 失败时的错误信息 */
  error?: string;
}

// ============================================================================
// 缓存相关类型
// ============================================================================

/**
 * 缓存配置接口
 */
export interface IScanCacheConfig {
  /** 最大缓存数量，默认 100 */
  maxSize: number;
  /** 过期时间（毫秒），默认 300000 (5分钟) */
  expirationMs: number;
}

/**
 * 缓存条目接口
 */
export interface ICacheEntry {
  /** 缓存的码值 */
  value: string;
  /** 添加到缓存的时间戳 */
  timestamp: number;
  /** 上次提示时间，用于重复提示间隔 */
  lastNotificationTime?: number;
}

// ============================================================================
// 错误处理相关类型
// ============================================================================

/**
 * 扫码错误类型
 */
export type TScanErrorType = 'permission' | 'camera' | 'processing';

// ScanErrorType 已废弃，请直接使用 TScanErrorType

/**
 * 扫码错误接口
 */
export interface IScanError {
  /** 错误类型 */
  type: TScanErrorType;
  /** 错误消息 */
  message: string;
  /** 原始错误对象 */
  originalError?: Error;
}

// ============================================================================
// 震动反馈相关类型
// ============================================================================

/**
 * 震动配置接口
 */
export interface IVibrationConfig {
  /** 成功震动模式，默认 [50] */
  successPattern: number[];
  /** 重复震动模式，默认 [30, 50, 30] */
  duplicatePattern: number[];
  /** 错误震动模式，默认 [200] */
  errorPattern: number[];
}

// ============================================================================
// 快速扫码模式相关类型
// ============================================================================

/**
 * 快速扫码模式配置接口
 */
export interface IQuickScanConfig {
  /** 快速模式扫码间隔，默认 200ms */
  scanInterval?: number;
  /** 快速模式识别框时长，默认 300ms */
  recognitionFrameDuration?: number;
  /** 快速模式震动模式，默认 [20] */
  vibrationPattern?: number[];
}

// ============================================================================
// 识别框相关类型
// ============================================================================

/**
 * 条码矩形区域接口
 */
export interface IBarcodeRect {
  /** X 坐标 */
  x: number;
  /** Y 坐标 */
  y: number;
  /** 宽度 */
  width: number;
  /** 高度 */
  height: number;
}

/**
 * 识别框类型
 */
export type TRecognitionFrameType = 'new' | 'cached';

// RecognitionFrameType 已废弃，请直接使用 TRecognitionFrameType

/**
 * 识别框组件属性接口
 */
export interface IRecognitionFrameProps {
  /** 是否可见 */
  visible: boolean;
  /** 识别框类型：new=绿色，cached=黄色 */
  type: TRecognitionFrameType;
  /** 条码位置 */
  bounds?: IBarcodeRect;
  /** 显示时长（毫秒） */
  duration?: number;
  /** 隐藏回调 */
  onHide?: () => void;
}

// ============================================================================
// CodeScanner 主组件属性
// ============================================================================

/**
 * CodeScanner 组件属性接口
 */
export interface ICodeScannerProps {
  // 回调函数
  /** 扫码成功回调 */
  onScan: (result: IScanResult) => void;
  /** 重复扫码回调 */
  onDuplicateScan?: (result: IScanResult) => void;
  /** 权限拒绝回调 */
  onPermissionDenied?: (error: IScanError) => void;
  /** 错误回调 */
  onError?: (error: IScanError) => void;

  // 扫码配置
  /** 扫码间隔，默认 1000ms */
  scanInterval?: number;
  /** 扫码后延迟，默认 0ms */
  scanDelay?: number;
  /** 启用重复检测，默认 true */
  enableDuplicateDetection?: boolean;
  /** 允许重复扫码触发 onScan，默认 false */
  allowDuplicateScan?: boolean;
  /** 重复提示间隔，默认 3000ms */
  duplicateNotificationInterval?: number;

  // 缓存配置
  /** 缓存配置 */
  cacheConfig?: Partial<IScanCacheConfig>;

  // 快速扫码模式
  /** 启用快速扫码模式，默认 false */
  quickScanMode?: boolean;
  /** 快速扫码模式配置 */
  quickScanConfig?: IQuickScanConfig;

  // 反馈配置
  /** 启用震动反馈，默认 true */
  enableVibration?: boolean;
  /** 震动配置 */
  vibrationConfig?: Partial<IVibrationConfig>;

  // 识别框配置
  /** 显示识别框，默认 true */
  showRecognitionFrame?: boolean;
  /** 识别框显示时长，默认 500ms */
  recognitionFrameDuration?: number;

  // UI 配置
  /** 显示扫描框，默认 true */
  showScanFrame?: boolean;
  /** 扫描框自定义样式 */
  scanFrameStyle?: ViewStyle;
  /** 手电筒模式 */
  torchMode?: 'on' | 'off';
  /** 是否暂停扫码 */
  paused?: boolean;
  /** 容器样式 */
  style?: ViewStyle;
}

// ============================================================================
// 默认配置常量
// ============================================================================

/**
 * 默认缓存配置
 */
export const DEFAULT_CACHE_CONFIG: IScanCacheConfig = {
  maxSize: 100,
  expirationMs: 5 * 60 * 1000, // 5分钟
};

/**
 * 默认震动配置
 */
export const DEFAULT_VIBRATION_CONFIG: IVibrationConfig = {
  successPattern: [50],
  duplicatePattern: [30, 50, 30],
  errorPattern: [200],
};

/**
 * 默认快速扫码配置
 */
export const DEFAULT_QUICK_SCAN_CONFIG: Required<IQuickScanConfig> = {
  scanInterval: 200,
  recognitionFrameDuration: 300,
  vibrationPattern: [20],
};

/**
 * 默认扫码间隔（毫秒）
 */
export const DEFAULT_SCAN_INTERVAL = 1000;

/**
 * 默认识别框显示时长（毫秒）
 */
export const DEFAULT_RECOGNITION_FRAME_DURATION = 500;

/**
 * 默认重复提示间隔（毫秒）
 */
export const DEFAULT_DUPLICATE_NOTIFICATION_INTERVAL = 3000;
