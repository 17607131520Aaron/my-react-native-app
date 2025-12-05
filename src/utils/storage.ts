/**
 * 本地存储工具
 * 封装 AsyncStorage 提供类型安全的存储方法
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 存储数据
 */
export const setStorage = async <T = unknown>(
  key: string,
  value: T,
): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error saving to storage:', error);
    throw error;
  }
};

/**
 * 获取数据
 */
export const getStorage = async <T = unknown>(
  key: string,
): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? (JSON.parse(jsonValue) as T) : null;
  } catch (error) {
    console.error('Error reading from storage:', error);
    return null;
  }
};

/**
 * 删除数据
 */
export const removeStorage = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from storage:', error);
    throw error;
  }
};

/**
 * 清空所有数据
 */
export const clearStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
};

