/**
 * ScanResultSerializer
 * 处理 ScanResult 对象的序列化和反序列化
 */

import type { IScanResult, ISerializationResult } from './types';

/**
 * 验证一个对象是否具有必需的 ScanResult 属性
 * @param obj - 要验证的对象
 * @returns 如果对象是有效的 ScanResult 返回 true
 */
function isValidScanResult(obj: unknown): obj is IScanResult {
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
 * ScanResultSerializer 类
 * 提供序列化和反序列化 ScanResult 对象的静态方法
 */
export class ScanResultSerializer {
  /**
   * 将 ScanResult 序列化为 JSON 字符串
   * @param result - 要序列化的 ScanResult
   * @returns ScanResult 的 JSON 字符串表示
   */
  static serialize(result: IScanResult): string {
    return JSON.stringify({
      value: result.value,
      codeType: result.codeType,
      timestamp: result.timestamp,
    });
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
          error: '无效的 ScanResult 结构：缺少或无效的必需字段（value、codeType、timestamp）',
        };
      }

      return {
        success: true,
        data: {
          value: parsed.value,
          codeType: parsed.codeType,
          timestamp: parsed.timestamp,
        },
      };
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : '未知解析错误';
      return {
        success: false,
        error: `JSON 解析失败：${errorMessage}`,
      };
    }
  }

  /**
   * 将 ScanResult 数组序列化为 JSON 字符串
   * @param results - 要序列化的 ScanResult 数组
   * @returns ScanResult 数组的 JSON 字符串表示
   */
  static serializeArray(results: IScanResult[]): string {
    return JSON.stringify(
      results.map((result) => ({
        value: result.value,
        codeType: result.codeType,
        timestamp: result.timestamp,
      })),
    );
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
          error: '无效的 ScanResult 数组：期望是一个数组',
        };
      }

      const results: IScanResult[] = [];

      for (let i = 0; i < parsed.length; i++) {
        if (!isValidScanResult(parsed[i])) {
          return {
            success: false,
            error: `索引 ${i} 处的 ScanResult 无效：缺少或无效的必需字段（value、codeType、timestamp）`,
          };
        }

        results.push({
          value: parsed[i].value,
          codeType: parsed[i].codeType,
          timestamp: parsed[i].timestamp,
        });
      }

      return {
        success: true,
        data: results,
      };
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : '未知解析错误';
      return {
        success: false,
        error: `JSON 解析失败：${errorMessage}`,
      };
    }
  }
}
