/**
 * Store 统一导出
 */

// 通用 Store
export { useAppStore, type IAppState, type TTheme } from './common/appStore';

// 业务 Store
export { useUserStore, type IUserState, type IUserProfile } from './business/user/userStore';

export {
  useScanStore,
  type IScanState,
  type IScanRecord,
  type IScanSettings,
} from './business/scan/scanStore';

// 核心工具
export {
  clearPersistByNamespace,
  clearAllPersist,
  getStorageKey,
  getNamespaceKeys,
} from './core/persist';

export { createBusinessStore, createCommonStore, createPlainStore } from './core/createStore';

// 类型
export type {
  IPersistConfig,
  IHydrationState,
  IPersistedData,
  ISerializer,
  ICreateStoreOptions,
} from './core/types';
