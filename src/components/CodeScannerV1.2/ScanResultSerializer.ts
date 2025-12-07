/**
 * ScanResultSerializer - 扫码结果序列化工具
 * 提供扫码结果的 JSON 序列化和反序列化功能
 *
 * @module CodeScanner/ScanResultSerializer
 */

import type { IScanResult, ISerializationResult } from './types';

/**
 * 类型守卫：检查对象是否为有效的 IScanResult
 * @param obj - 要检查的对象
 * @returns 如果是有效的 IScanResult 返回 true
 */
export function isValidScanResult(obj: unknown): obj is IScanResult {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const candidate = obj as Record<string, unknown>;

  return (
    typeof candidate.value === 'string' &&
    typeof candidate.codeType === 'string' &&
    typeof candidate.timestamp === 'number'
  );
}

/**
 * 扫码结果序列化工具类
 *
 * 功能：
 * - 序列化单个/数组扫码结果为 JSON
 * - 反序列化 JSON 为扫码结果（含验证）
 * - 错误处理和类型安全
 */
export class ScanResultSerializer {
  /**
   * 将 ScanResult 序列化为 JSON 字符串
   * @param result - 要序列化的 ScanResult
   * @returns ScanResult 的 JSON 字符串表示
   */
  static serialize(result: IScanResult): string {
    return JSON.stringify(result);
  }

  /**
   * 将 JSON 字符串反序列化为 ScanResult
   * @param json - 要反序列化的 JSON 字符串
   * @returns 包含 ScanResult 或错误的 SerializationResult
   */
  static deserialize(json: string): ISerializationResult<IScanResult> {
    try {
      const parsed = JSON.parse(json);

      if (!isValidScanResult(parsed)) {
        return {
          success: false,
          error: '无效的 ScanResult 结构：缺少必需字段或字段类型错误',
        };
      }

      return {
        success: true,
        data: parsed,
      };
    } catch (error) {
      return {
        success: false,
        error: `JSON 解析失败：${error instanceof Error ? error.message : '未知错误'}`,
      };
    }
  }

  /**
   * 将 ScanResult 数组序列化为 JSON 字符串
   * @param results - 要序列化的 ScanResult 数组
   * @returns ScanResult 数组的 JSON 字符串表示
   */
  static serializeArray(results: IScanResult[]): string {
    return JSON.stringify(results);
  }

  /**
   * 将 JSON 字符串反序列化为 ScanResult 数组
   * @param json - 要反序列化的 JSON 字符串
   * @returns 包含 ScanResult 数组或错误的 SerializationResult
   */
  static deserializeArray(json: string): ISerializationResult<IScanResult[]> {
    try {
      const parsed = JSON.parse(json);

      if (!Array.isArray(parsed)) {
        return {
          success: false,
          error: '无效的数据结构：期望数组',
        };
      }

      const results: IScanResult[] = [];
      for (let i = 0; i < parsed.length; i++) {
        if (!isValidScanResult(parsed[i])) {
          return {
            success: false,
            error: `数组索引 ${i} 处的 ScanResult 无效：缺少必需字段或字段类型错误`,
          };
        }
        results.push(parsed[i]);
      }

      return {
        success: true,
        data: results,
      };
    } catch (error) {
      return {
        success: false,
        error: `JSON 解析失败：${error instanceof Error ? error.message : '未知错误'}`,
      };
    }
  }
}
