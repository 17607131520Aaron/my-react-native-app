/**
 * Zustand 持久化中间件
 * 支持命名空间、可配置的持久化策略、序列化器集成
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import { APP_CONFIG } from '~/common/config';

import { deserialize, serialize } from './serializer';

import type { IHydrationState, IPersistConfig, IPersistedData } from './types';
import type { StateCreator } from 'zustand';

/**
 * 生成存储键名
 * @param namespace 命名空间
 * @param key 键名
 */
export const getStorageKey = (namespace?: string, key?: string): string => {
  const baseKey = key ?? 'store';
  if (namespace) {
    return `${APP_CONFIG.storagePrefix}store:${namespace}:${baseKey}`;
  }
  return `${APP_CONFIG.storagePrefix}store:${baseKey}`;
};

/**
 * 过滤状态（根据白名单/黑名单）
 * whitelist 优先于 blacklist
 */
export const filterState = <T extends Record<string, unknown>>(
  state: T,
  config: IPersistConfig,
): Partial<T> => {
  const { whitelist, blacklist } = config;

  if (whitelist && whitelist.length > 0) {
    const filtered: Partial<T> = {};
    whitelist.forEach((k) => {
      if (k in state) {
        filtered[k as keyof T] = state[k as keyof T];
      }
    });
    return filtered;
  }

  if (blacklist && blacklist.length > 0) {
    const filtered = { ...state };
    blacklist.forEach((k) => {
      delete filtered[k as keyof T];
    });
    return filtered;
  }

  return state;
};

/** 持久化存储适配器 */
const storage = {
  getItem: async <T>(name: string): Promise<IPersistedData<T> | null> => {
    try {
      const value = await AsyncStorage.getItem(name);
      if (value) {
        return deserialize(value) as IPersistedData<T>;
      }
      return null;
    } catch (error) {
      console.error(`[Persist] Error getting item ${name}:`, error);
      return null;
    }
  },
  setItem: async <T>(name: string, data: IPersistedData<T>): Promise<void> => {
    try {
      const value = serialize(data);
      await AsyncStorage.setItem(name, value);
    } catch (error) {
      console.error(`[Persist] Error setting item ${name}:`, error);
      throw error;
    }
  },
};

/** 持久化选项 */
export type TPersistOptions = IPersistConfig & { name: string };

/**
 * 持久化中间件
 */
export const persist = <T extends Record<string, unknown>>(
  config: StateCreator<T, [], []>,
  options: TPersistOptions,
): StateCreator<T & IHydrationState, [], []> => {
  return (set, get, api) => {
    const { name, enabled: isEnabled = true, namespace, key, version = 0, migrate } = options;

    type TState = T & IHydrationState;
    const setState = set as (partial: Partial<TState>) => void;
    const getState = get as () => TState;

    if (!isEnabled) {
      const initialState = config(set, get, api);
      return {
        ...initialState,
        hydrated: true,
        setHydrated: (value: boolean) => setState({ hydrated: value } as Partial<TState>),
      } as TState;
    }

    const storageKey = getStorageKey(namespace, key ?? name);

    const saveState = async (state: T): Promise<void> => {
      try {
        const stateToSave = filterState(state, options);
        const data: IPersistedData<Partial<T>> = {
          state: stateToSave,
          version,
          timestamp: Date.now(),
        };
        await storage.setItem(storageKey, data);
      } catch (error) {
        console.error(`[Persist] Error saving state for ${name}:`, error);
      }
    };

    const setWithPersist = ((partial: Partial<T>) => {
      set(partial as Parameters<typeof set>[0]);
      const currentState = getState();

      // 排除 hydrated 和 setHydrated 字段
      const stateToSave = Object.fromEntries(
        Object.entries(currentState).filter(([k]) => k !== 'hydrated' && k !== 'setHydrated'),
      ) as unknown as T;
      saveState(stateToSave).catch(console.error);
    }) as typeof set;

    const initialConfig = config(setWithPersist, get, api);

    const restoreState = async (): Promise<void> => {
      try {
        const stored = await storage.getItem<T>(storageKey);
        if (stored?.state) {
          let { state } = stored;
          if (migrate && stored.version !== version) {
            state = migrate(state, stored.version) as typeof state;
          }
          setState({ ...state, hydrated: true } as unknown as Partial<TState>);
        } else {
          setState({ hydrated: true } as Partial<TState>);
        }
      } catch (error) {
        console.error(`[Persist] Error restoring state for ${name}:`, error);
        setState({ hydrated: true } as Partial<TState>);
      }
    };

    restoreState();

    return {
      ...initialConfig,
      hydrated: false,
      setHydrated: (value: boolean) => setState({ hydrated: value } as Partial<TState>),
    } as TState;
  };
};

/**
 * 获取指定命名空间下的所有存储键
 */
export const getNamespaceKeys = async (namespace: string): Promise<string[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const prefix = `${APP_CONFIG.storagePrefix}store:${namespace}:`;
    return keys.filter((k) => k.startsWith(prefix));
  } catch (error) {
    console.error(`[Persist] Error getting namespace keys for ${namespace}:`, error);
    throw error;
  }
};

/**
 * 清除指定命名空间的持久化数据
 */
export const clearPersistByNamespace = async (namespace: string): Promise<void> => {
  try {
    const keysToRemove = await getNamespaceKeys(namespace);
    if (keysToRemove.length > 0) {
      await AsyncStorage.multiRemove(keysToRemove);
    }
  } catch (error) {
    console.error(`[Persist] Error clearing namespace ${namespace}:`, error);
    throw error;
  }
};

/**
 * 清除所有持久化数据
 */
export const clearAllPersist = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const storeKeys = keys.filter((k) => k.startsWith(`${APP_CONFIG.storagePrefix}store:`));
    if (storeKeys.length > 0) {
      await AsyncStorage.multiRemove(storeKeys);
    }
  } catch (error) {
    console.error('[Persist] Error clearing all persist data:', error);
    throw error;
  }
};
