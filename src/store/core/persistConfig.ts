/**
 * 持久化配置
 * 统一管理所有 Store 的持久化设置
 * 默认全部不持久化，需要持久化的在此配置
 */

import type { IPersistConfig } from './types';

/** Store 持久化配置映射 */
export interface IStorePersistConfig {
  /** 是否启用持久化 */
  enabled: boolean;
  /** 持久化配置 */
  config?: Partial<IPersistConfig>;
}

/** 所有 Store 的持久化配置 */
export const PERSIST_CONFIG: Record<string, IStorePersistConfig> = {
  // ========== 通用 Store ==========
  app: {
    enabled: true,
    config: {
      whitelist: ['theme', 'language'],
    },
  },

  // ========== 业务 Store ==========
  user: {
    enabled: true,
    config: {
      whitelist: ['token', 'profile', 'isAuthenticated'],
    },
  },

  scan: {
    enabled: true,
    config: {
      whitelist: ['history', 'settings'],
    },
  },

  // 示例：不需要持久化的 Store
  // someStore: {
  //   enabled: false,
  // },
};

/**
 * 获取 Store 的持久化配置
 * @param storeName Store 名称
 * @returns 持久化配置，如果未配置则返回 { enabled: false }
 */
export const getPersistConfig = (storeName: string): IStorePersistConfig => {
  return PERSIST_CONFIG[storeName] ?? { enabled: false };
};
