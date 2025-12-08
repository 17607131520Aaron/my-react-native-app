/**
 * 扫码结果过滤工具函数
 */

import { Dimensions } from 'react-native';

import { AREA_TOLERANCE } from '../constants';

import type { ICodeBounds, IRawScanResult, IScanArea } from '../types';

const { width: screenWidth } = Dimensions.get('window');

// ============================================================================
// 区域过滤
// ============================================================================

/**
 * 将原始扫码结果转换为标准位置信息
 */
export function extractBounds(raw: IRawScanResult): ICodeBounds | undefined {
  if (!raw.bounds) {
    return undefined;
  }

  return {
    top: raw.bounds.origin.y,
    left: raw.bounds.origin.x,
    width: raw.bounds.size.width,
    height: raw.bounds.size.height,
  };
}

/**
 * 检查条码是否在扫描区域内
 * @param bounds 条码位置信息
 * @param scanArea 扫描区域配置
 * @param tolerance 容差值
 */
export function isInScanArea(
  bounds: ICodeBounds,
  scanArea: IScanArea,
  tolerance: number = AREA_TOLERANCE,
): boolean {
  // 计算扫描区域的边界
  const scanLeft = (screenWidth - scanArea.width) / 2;
  const scanRight = scanLeft + scanArea.width;
  const scanTop = scanArea.topOffset;
  const scanBottom = scanTop + scanArea.height;

  // 计算条码的边界
  const codeLeft = bounds.left;
  const codeRight = bounds.left + bounds.width;
  const codeTop = bounds.top;
  const codeBottom = bounds.top + bounds.height;

  // 检查条码是否在扫描区域内（考虑容差）
  const isLeftIn = codeLeft >= scanLeft - tolerance;
  const isRightIn = codeRight <= scanRight + tolerance;
  const isTopIn = codeTop >= scanTop - tolerance;
  const isBottomIn = codeBottom <= scanBottom + tolerance;

  return isLeftIn && isRightIn && isTopIn && isBottomIn;
}

/**
 * 根据扫描区域过滤条码
 * @param results 原始扫码结果数组
 * @param scanArea 扫描区域配置
 * @param shouldLimitArea 是否限制区域
 */
export function filterByArea(
  results: IRawScanResult[],
  scanArea?: IScanArea,
  shouldLimitArea: boolean = false,
): IRawScanResult[] {
  // 如果不需要限制区域或没有配置扫描区域，直接返回所有结果
  if (!shouldLimitArea || !scanArea) {
    return results;
  }

  return results.filter((result) => {
    const bounds = extractBounds(result);
    // 如果没有位置信息，保留该结果（兼容不支持位置信息的情况）
    if (!bounds) {
      return true;
    }
    return isInScanArea(bounds, scanArea);
  });
}

// ============================================================================
// 距离排序
// ============================================================================

/**
 * 计算条码中心点到扫描区域中心点的欧几里得距离
 */
export function calculateDistance(bounds: ICodeBounds, scanArea: IScanArea): number {
  // 计算扫描区域中心点
  const scanCenterX = screenWidth / 2;
  const scanCenterY = scanArea.topOffset + scanArea.height / 2;

  // 计算条码中心点
  const codeCenterX = bounds.left + bounds.width / 2;
  const codeCenterY = bounds.top + bounds.height / 2;

  // 计算欧几里得距离
  return Math.sqrt(Math.pow(codeCenterX - scanCenterX, 2) + Math.pow(codeCenterY - scanCenterY, 2));
}

/**
 * 根据与扫描区域中心点的距离排序
 * @param results 原始扫码结果数组
 * @param scanArea 扫描区域配置
 */
export function sortByDistance(results: IRawScanResult[], scanArea?: IScanArea): IRawScanResult[] {
  if (!scanArea || results.length <= 1) {
    return results;
  }

  return [...results].sort((a, b) => {
    const boundsA = extractBounds(a);
    const boundsB = extractBounds(b);

    // 如果没有位置信息，放到最后
    if (!boundsA && !boundsB) return 0;
    if (!boundsA) return 1;
    if (!boundsB) return -1;

    const distanceA = calculateDistance(boundsA, scanArea);
    const distanceB = calculateDistance(boundsB, scanArea);

    return distanceA - distanceB;
  });
}

// ============================================================================
// 正则过滤
// ============================================================================

/**
 * 检查字符串是否匹配任一正则
 */
export function matchesAnyPattern(str: string, patterns: RegExp[]): boolean {
  if (!patterns || patterns.length === 0) {
    return false;
  }
  return patterns.some((pattern) => pattern.test(str));
}

/**
 * 根据正则表达式过滤条码
 * 执行顺序：先排除后包含
 * @param results 原始扫码结果数组
 * @param excludePatterns 排除正则数组
 * @param includePatterns 包含正则数组
 */
export function filterByPatterns(
  results: IRawScanResult[],
  excludePatterns: RegExp[] = [],
  includePatterns: RegExp[] = [],
): IRawScanResult[] {
  let filtered = results;

  // 1. 先执行排除过滤
  if (excludePatterns.length > 0) {
    filtered = filtered.filter(
      (result) => !matchesAnyPattern(result.codeStringValue, excludePatterns),
    );
  }

  // 2. 再执行包含过滤
  if (includePatterns.length > 0) {
    filtered = filtered.filter((result) =>
      matchesAnyPattern(result.codeStringValue, includePatterns),
    );
  }

  return filtered;
}

// ============================================================================
// 综合过滤
// ============================================================================

/**
 * 综合过滤和排序扫码结果
 */
export function processResults(
  results: IRawScanResult[],
  options: {
    scanArea?: IScanArea;
    shouldLimitArea?: boolean;
    excludePatterns?: RegExp[];
    includePatterns?: RegExp[];
  },
): IRawScanResult[] {
  const { scanArea, shouldLimitArea = false, excludePatterns = [], includePatterns = [] } = options;

  // 1. 区域过滤
  let processed = filterByArea(results, scanArea, shouldLimitArea);

  // 2. 正则过滤
  processed = filterByPatterns(processed, excludePatterns, includePatterns);

  // 3. 距离排序
  processed = sortByDistance(processed, scanArea);

  return processed;
}
