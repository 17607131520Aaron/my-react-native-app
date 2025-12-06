/**
 * 序列化工具
 * 处理特殊数据类型（如 Date）的序列化和反序列化
 */

import type { ISerializer } from './types';

/** Date 类型标记 */
const DATE_TYPE_MARKER = '__type';
const DATE_TYPE_VALUE = 'Date';

/**
 * 递归处理对象，将 Date 对象转换为带类型标记的格式
 * 需要在 JSON.stringify 之前处理，因为 JSON.stringify 的 replacer
 * 接收到的 Date 已经被转换为字符串
 */
const prepareDateForSerialization = (value: unknown): unknown => {
  if (value instanceof Date) {
    return { [DATE_TYPE_MARKER]: DATE_TYPE_VALUE, value: value.toISOString() };
  }
  if (Array.isArray(value)) {
    return value.map(prepareDateForSerialization);
  }
  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(value)) {
      result[key] = prepareDateForSerialization((value as Record<string, unknown>)[key]);
    }
    return result;
  }
  return value;
};

/**
 * 序列化值为 JSON 字符串
 * 将 Date 对象转换为带类型标记的 ISO 字符串格式
 * @param value 要序列化的值
 * @returns JSON 字符串
 */
export const serialize = (value: unknown): string => {
  try {
    const prepared = prepareDateForSerialization(value);
    return JSON.stringify(prepared);
  } catch (error) {
    console.error('[Serializer] Error serializing value:', error);
    // 返回原始值的字符串表示
    return String(value);
  }
};

/**
 * 反序列化 JSON 字符串为值
 * 将带类型标记的 ISO 字符串还原为 Date 对象
 * @param value JSON 字符串
 * @returns 反序列化后的值
 */
export const deserialize = (value: string): unknown => {
  try {
    return JSON.parse(value, (_key, val) => {
      if (val && typeof val === 'object' && val[DATE_TYPE_MARKER] === DATE_TYPE_VALUE) {
        return new Date(val.value);
      }
      return val;
    });
  } catch (error) {
    console.error('[Serializer] Error deserializing value:', error);
    return null;
  }
};

/**
 * 默认序列化器实例
 */
export const defaultSerializer: ISerializer = {
  serialize,
  deserialize,
};
