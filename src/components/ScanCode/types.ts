/**
 * ScanCode 组件类型定义
 */

import type { StyleProp, ViewStyle } from 'react-native';

// ============================================================================
// 条码类型
// ============================================================================

/**
 * 支持的条码类型
 */
export type TCodeType =
  | 'qr'
  | 'ean-13'
  | 'ean-8'
  | 'code-128'
  | 'code-39'
  | 'code-93'
  | 'upc-a'
  | 'upc-e'
  | 'pdf417'
  | 'codabar';

// ============================================================================
// 扫描区域
// ============================================================================

/**
 * 扫描区域配置
 */
export interface IScanArea {
  /** 扫描区域宽度 */
  width: number;
  /** 扫描区域高度 */
  height: number;
  /** 扫描区域距离顶部的偏移量 */
  topOffset: number;
}

/**
 * 条码位置信息
 */
export interface ICodeBounds {
  top: number;
  left: number;
  width: number;
  height: number;
}

// ============================================================================
// 扫码结果
// ============================================================================

/**
 * 扫码结果
 */
export interface IScanResult {
  /** 条码数据 */
  data: string;
  /** 条码类型 */
  type: TCodeType;
  /** 扫描时间戳 */
  timestamp: number;
  /** 条码位置信息 */
  bounds?: ICodeBounds;
}

/**
 * 原始扫码结果（来自 CameraKit）
 */
export interface IRawScanResult {
  /** 条码数据 */
  codeStringValue: string;
  /** 条码格式 */
  codeFormat: string;
  /** 位置信息 */
  bounds?: {
    origin: { x: number; y: number };
    size: { width: number; height: number };
  };
}

// ============================================================================
// 组件 Props
// ============================================================================

/**
 * ScanCode 组件 Props
 */
export interface IScanCodeProps {
  // ========== 基础配置 ==========
  /** 容器样式 */
  style?: StyleProp<ViewStyle>;
  /** 支持的条码类型 */
  codeTypes?: TCodeType[];

  // ========== 生命周期控制 ==========
  /** 控制组件是否激活，默认 true */
  isActive?: boolean;
  /** 页面失焦时是否暂停，默认 true */
  shouldPauseOnBlur?: boolean;
  /** 应用进入后台时是否暂停，默认 true */
  shouldPauseOnBackground?: boolean;

  // ========== 扫码区域 ==========
  /** 扫描区域配置 */
  scanArea?: IScanArea;
  /** 是否限制扫码区域 */
  shouldLimitArea?: boolean;
  /** 遮罩颜色 */
  maskColor?: string;

  // ========== 过滤配置 ==========
  /** 包含正则（匹配任一则保留） */
  includePatterns?: RegExp[];
  /** 排除正则（匹配任一则排除） */
  excludePatterns?: RegExp[];

  // ========== 缓存配置 ==========
  /** 是否启用缓存，默认 true */
  isCacheEnabled?: boolean;
  /** 缓存超时时间（毫秒），默认 10000 */
  cacheTimeout?: number;

  // ========== 频率控制 ==========
  /** 扫码间隔（毫秒），默认 800 */
  scanInterval?: number;
  /** 扫码超时时间（毫秒） */
  scanTimeout?: number;

  // ========== 反馈配置 ==========
  /** 是否启用震动，默认 true */
  isVibrationEnabled?: boolean;
  /** 是否开启闪光灯，默认 false */
  isFlashlightEnabled?: boolean;
  /** 是否显示扫描动画，默认 true */
  shouldShowScanAnimation?: boolean;

  // ========== 回调函数 ==========
  /** 扫码成功回调 */
  onCodeScanned?: (result: IScanResult) => void;
  /** 多码扫描回调 */
  onMultipleCodesScanned?: (results: IScanResult[]) => void;
  /** 缓存命中回调 */
  onCachedCodeScanned?: (result: IScanResult) => void;
  /** 扫码超时回调 */
  onScanTimeout?: () => void;
  /** 相机权限被拒绝回调 */
  onCameraPermissionDenied?: () => void;
  /** 相机错误回调 */
  onCameraError?: (error: Error) => void;

  // ========== 子组件 ==========
  /** 子组件 */
  children?: React.ReactNode;
}

// ============================================================================
// Hook 类型
// ============================================================================

/**
 * useScanCodeLogic Hook 配置
 */
export interface IUseScanCodeLogicOptions {
  codeTypes: TCodeType[];
  scanArea?: IScanArea;
  shouldLimitArea: boolean;
  includePatterns: RegExp[];
  excludePatterns: RegExp[];
  isCacheEnabled: boolean;
  cacheTimeout: number;
  scanInterval: number;
  scanTimeout?: number;
  isVibrationEnabled: boolean;
  onCodeScanned?: (result: IScanResult) => void;
  onMultipleCodesScanned?: (results: IScanResult[]) => void;
  onCachedCodeScanned?: (result: IScanResult) => void;
  onScanTimeout?: () => void;
}

/**
 * useScanCodeLogic Hook 返回值
 */
export interface IUseScanCodeLogicReturn {
  /** 是否正在扫码 */
  isScanning: boolean;
  /** 闪光灯是否开启 */
  isFlashlightOn: boolean;
  /** 处理扫码结果 */
  handleCodeRead: (codes: IRawScanResult[]) => void;
  /** 暂停扫码 */
  pauseScanning: () => void;
  /** 恢复扫码 */
  resumeScanning: () => void;
  /** 切换闪光灯 */
  toggleFlashlight: () => void;
  /** 清空缓存 */
  clearCache: () => void;
  /** 从缓存中移除指定条码 */
  removeFromCache: (code: string) => void;
  /** 清理资源 */
  cleanup: () => void;
}

// ============================================================================
// 缓存类型
// ============================================================================

/**
 * 缓存条目
 */
export interface ICacheEntry {
  /** 条码数据 */
  code: string;
  /** 添加时间戳 */
  timestamp: number;
  /** 超时定时器 ID */
  timerId: ReturnType<typeof setTimeout>;
}

/**
 * 缓存管理器返回值
 */
export interface ICacheManagerReturn {
  /** 添加到缓存 */
  addToCache: (code: string) => void;
  /** 检查是否在缓存中 */
  isInCache: (code: string) => boolean;
  /** 从缓存中移除 */
  removeFromCache: (code: string) => void;
  /** 清空缓存 */
  clearCache: () => void;
}
