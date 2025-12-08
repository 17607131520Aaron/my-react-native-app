/**
 * ScanCode 组件常量定义
 */

import type { TCodeType } from './types';

// ============================================================================
// 默认配置
// ============================================================================

/** 默认扫码间隔（毫秒） */
export const DEFAULT_SCAN_INTERVAL = 800;

/** 默认缓存超时时间（毫秒） */
export const DEFAULT_CACHE_TIMEOUT = 10000;

/** 默认遮罩颜色 */
export const DEFAULT_MASK_COLOR = 'rgba(0, 0, 0, 0.6)';

/** 区域过滤容差（像素） */
export const AREA_TOLERANCE = 20;

// ============================================================================
// 默认条码格式
// ============================================================================

/** 默认支持的条码格式 */
export const DEFAULT_CODE_TYPES: TCodeType[] = ['qr', 'ean-13', 'code-128', 'code-39'];

// ============================================================================
// 条码类型映射
// ============================================================================

/**
 * 组件条码类型到 CameraKit 条码类型的映射
 * CameraKit 使用的是 iOS/Android 原生的条码类型字符串
 */
export const CODE_TYPE_MAP: Record<TCodeType, string> = {
  qr: 'qr',
  'ean-13': 'ean-13',
  'ean-8': 'ean-8',
  'code-128': 'code-128',
  'code-39': 'code-39',
  'code-93': 'code-93',
  'upc-a': 'upc-a',
  'upc-e': 'upc-e',
  pdf417: 'pdf417',
  codabar: 'codabar',
};

/**
 * CameraKit 条码类型到组件条码类型的反向映射
 */
export const REVERSE_CODE_TYPE_MAP: Record<string, TCodeType> = Object.entries(
  CODE_TYPE_MAP,
).reduce((acc, [key, value]) => {
  acc[value] = key as TCodeType;
  acc[value.toUpperCase()] = key as TCodeType;
  acc[value.toLowerCase()] = key as TCodeType;
  return acc;
}, {} as Record<string, TCodeType>);

// ============================================================================
// 动画配置
// ============================================================================

/** 扫描动画持续时间（毫秒） */
export const SCAN_ANIMATION_DURATION = 2000;

/** 扫描动画高度 */
export const SCAN_ANIMATION_HEIGHT = 2;
