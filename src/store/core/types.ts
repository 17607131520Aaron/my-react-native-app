/**
 * Zustand Store 核心类型定义
 */

/**
 * 持久化配置选项
 */
export interface IPersistConfig {
  /** 是否启用持久化，默认 true */
  enabled?: boolean;
  /** 存储键名（如果不提供，将使用命名空间） */
  key?: string;
  /** 命名空间，用于隔离不同业务模块的存储 */
  namespace?: string;
  /** 需要持久化的字段白名单（如果提供，只持久化这些字段） */
  whitelist?: string[];
  /** 不需要持久化的字段黑名单 */
  blacklist?: string[];
  /** 版本号，用于数据迁移 */
  version?: number;
  /** 数据迁移函数 */
  migrate?: (persistedState: unknown, version: number) => unknown;
}

/**
 * Store 创建选项
 */
export interface ICreateStoreOptions<T> {
  /** Store 名称，用于调试和日志 */
  name: string;
  /** 持久化配置 */
  persist?: IPersistConfig;
  /** 初始状态 */
  initialState?: Partial<T>;
}

/**
 * 水合状态接口
 * 用于追踪 Store 从持久化存储恢复状态的过程
 */
export interface IHydrationState {
  /** 是否已完成水合（状态恢复） */
  hydrated: boolean;
  /** 设置水合状态 */
  setHydrated: (hydrated: boolean) => void;
}

/**
 * 序列化器接口
 * 用于处理状态的序列化和反序列化
 */
export interface ISerializer {
  /** 将值序列化为字符串 */
  serialize: (value: unknown) => string;
  /** 将字符串反序列化为值 */
  deserialize: (value: string) => unknown;
}

/**
 * 持久化数据结构
 * 存储到 AsyncStorage 的数据格式
 */
export interface IPersistedData<T> {
  /** 持久化的状态数据 */
  state: T;
  /** 数据版本号 */
  version: number;
  /** 持久化时间戳 */
  timestamp: number;
}
