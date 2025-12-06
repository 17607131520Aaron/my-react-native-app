/**
 * Store 工厂函数
 * 提供便捷的 Store 创建方法
 */

import { create } from 'zustand';

import { persist, type TPersistOptions } from './persist';

import type { IHydrationState, IPersistConfig } from './types';
import type { StateCreator, StoreApi, UseBoundStore } from 'zustand';

/** Store 返回类型 */
type TStoreReturn<T> = UseBoundStore<StoreApi<T & IHydrationState>>;

/**
 * 创建业务 Store
 * @param name Store 名称
 * @param namespace 命名空间
 * @param creator Store 创建函数
 * @param persistConfig 持久化配置（可选）
 */
export const createBusinessStore = <T extends Record<string, unknown>>(
  name: string,
  namespace: string,
  creator: StateCreator<T, [], []>,
  persistConfig?: Partial<IPersistConfig>,
): TStoreReturn<T> => {
  const options: TPersistOptions = {
    name,
    namespace,
    ...persistConfig,
  };
  return create(persist(creator, options));
};

/**
 * 创建通用 Store
 * @param name Store 名称
 * @param creator Store 创建函数
 * @param persistConfig 持久化配置（可选）
 */
export const createCommonStore = <T extends Record<string, unknown>>(
  name: string,
  creator: StateCreator<T, [], []>,
  persistConfig?: Partial<IPersistConfig>,
): TStoreReturn<T> => {
  const options: TPersistOptions = {
    name,
    namespace: 'common',
    ...persistConfig,
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
