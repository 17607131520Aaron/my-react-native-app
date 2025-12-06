/**
 * Store 工厂函数
 * 提供便捷的 Store 创建方法
 */

import { create } from 'zustand';

import { persist, type TPersistOptions } from './persist';
import { getPersistConfig } from './persistConfig';

import type { IHydrationState, IPersistConfig } from './types';
import type { StateCreator, StoreApi, UseBoundStore } from 'zustand';

/** Store 返回类型 */
type TStoreReturn<T> = UseBoundStore<StoreApi<T & IHydrationState>>;

/**
 * 创建业务 Store
 * 持久化配置从 persistConfig.ts 中读取
 * @param name Store 名称
 * @param namespace 命名空间
 * @param creator Store 创建函数
 * @param overrideConfig 覆盖持久化配置（可选）
 */
export const createBusinessStore = <T extends Record<string, unknown>>(
  name: string,
  namespace: string,
  creator: StateCreator<T, [], []>,
  overrideConfig?: Partial<IPersistConfig>,
): TStoreReturn<T> => {
  const persistSetting = getPersistConfig(name);
  const options: TPersistOptions = {
    name,
    namespace,
    enabled: persistSetting.enabled,
    ...persistSetting.config,
    ...overrideConfig,
  };
  return create(persist(creator, options));
};

/**
 * 创建通用 Store
 * 持久化配置从 persistConfig.ts 中读取
 * @param name Store 名称
 * @param creator Store 创建函数
 * @param overrideConfig 覆盖持久化配置（可选）
 */
export const createCommonStore = <T extends Record<string, unknown>>(
  name: string,
  creator: StateCreator<T, [], []>,
  overrideConfig?: Partial<IPersistConfig>,
): TStoreReturn<T> => {
  const persistSetting = getPersistConfig(name);
  const options: TPersistOptions = {
    name,
    namespace: 'common',
    enabled: persistSetting.enabled,
    ...persistSetting.config,
    ...overrideConfig,
  };
  return create(persist(creator, options));
};

/**
 * 创建不带持久化的 Store
 * @param creator Store 创建函数
 */
export const createPlainStore = <T extends Record<string, unknown>>(
  creator: StateCreator<T, [], []>,
): UseBoundStore<StoreApi<T>> => {
  return create(creator);
};

export type { IHydrationState };
