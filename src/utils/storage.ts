import AsyncStorage from '@react-native-async-storage/async-storage';

import { APP_CONFIG } from '~/common/config';

/**
 * 存储数据
 * @param key 键
 * @param value 值
 */
export const setStorageItem = async (key: string, value: unknown): Promise<void> => {
  try {
    const jsonValue = typeof value === 'string' ? value : JSON.stringify(value);
    await AsyncStorage.setItem(`${APP_CONFIG.storagePrefix}${key}`, jsonValue);
  } catch (error) {
    console.error('Error saving data to storage:', error);
    throw error;
  }
};

/**
 * 获取数据
 * @param key 键
 * @param defaultValue 默认值
 */
export const getStorageItem = async <T>(key: string, defaultValue?: T): Promise<T | null> => {
  try {
    const value = await AsyncStorage.getItem(`${APP_CONFIG.storagePrefix}${key}`);

    if (value === null) {
      return defaultValue ?? null;
    }

    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  } catch (error) {
    console.error('Error reading data from storage:', error);
    return defaultValue ?? null;
  }
};

/**
 * 移除数据
 * @param key 键
 */
export const removeStorageItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(`${APP_CONFIG.storagePrefix}${key}`);
  } catch (error) {
    console.error('Error removing data from storage:', error);
    throw error;
  }
};

/**
 * 清除所有数据
 */
export const clearStorage = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const appKeys = keys.filter((key) => key.startsWith(APP_CONFIG.storagePrefix));
    await AsyncStorage.multiRemove(appKeys);
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
};

/**
 * 获取所有键
 */
export const getAllKeys = async (): Promise<string[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys
      .filter((key) => key.startsWith(APP_CONFIG.storagePrefix))
      .map((key) => key.replace(APP_CONFIG.storagePrefix, ''));
  } catch (error) {
    console.error('Error getting all keys:', error);
    return [];
  }
};
