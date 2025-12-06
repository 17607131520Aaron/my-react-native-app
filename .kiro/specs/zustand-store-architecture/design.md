# Design Document: Zustand Store Architecture

## Overview

本设计文档描述了一个基于 Zustand 的状态管理架构，专为 React Native 应用设计。该架构提供：

- **命名空间隔离**：不同业务模块的状态通过命名空间隔离存储
- **可配置持久化**：支持 whitelist/blacklist 控制持久化字段
- **分层架构**：业务 Store 与通用 Store 分离管理
- **类型安全**：完整的 TypeScript 类型支持

## Architecture

```
src/store/
├── core/                    # 核心基础设施
│   ├── types.ts            # 类型定义
│   ├── persist.ts          # 持久化中间件
│   ├── serializer.ts       # 序列化工具
│   └── createStore.ts      # Store 工厂函数
├── common/                  # 通用配置 Store
│   ├── index.ts            # 导出入口
│   └── appStore.ts         # 应用级配置
├── business/               # 业务 Store
│   ├── index.ts            # 导出入口
│   ├── user/               # 用户模块
│   │   └── userStore.ts
│   └── scan/               # 扫描模块
│       └── scanStore.ts
└── index.ts                # 统一导出
```

### 存储键名格式

```
{storagePrefix}store:{namespace}:{key}
```

示例：

- `@MallBrain:store:user:profile` - 用户模块的 profile 数据
- `@MallBrain:store:common:app` - 通用应用配置

## Components and Interfaces

### 1. 核心类型 (types.ts)

```typescript
// 持久化配置
interface IPersistConfig {
  enabled?: boolean; // 是否启用持久化
  key?: string; // 存储键名
  namespace?: string; // 命名空间
  whitelist?: string[]; // 持久化白名单
  blacklist?: string[]; // 持久化黑名单
  version?: number; // 版本号
  migrate?: (state: unknown, version: number) => unknown;
}

// 水合状态
interface IHydrationState {
  hydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
}

// 序列化器接口
interface ISerializer {
  serialize: (value: unknown) => string;
  deserialize: (value: string) => unknown;
}

// 持久化数据结构
interface IPersistedData<T> {
  state: T;
  version: number;
  timestamp: number;
}
```

### 2. 序列化器 (serializer.ts)

处理特殊数据类型的序列化和反序列化：

```typescript
// 序列化：将 Date 转换为 ISO 字符串
const serialize = (value: unknown): string => {
  return JSON.stringify(value, (key, val) => {
    if (val instanceof Date) {
      return { __type: 'Date', value: val.toISOString() };
    }
    return val;
  });
};

// 反序列化：将 ISO 字符串还原为 Date
const deserialize = (value: string): unknown => {
  return JSON.parse(value, (key, val) => {
    if (val && val.__type === 'Date') {
      return new Date(val.value);
    }
    return val;
  });
};
```

### 3. 持久化中间件 (persist.ts)

核心功能：

- 状态过滤（whitelist/blacklist）
- 异步存储和恢复
- 版本迁移
- 水合状态追踪

```typescript
// 键名生成
const getStorageKey = (namespace?: string, key?: string): string => {
  const baseKey = key || 'store';
  if (namespace) {
    return `${APP_CONFIG.storagePrefix}store:${namespace}:${baseKey}`;
  }
  return `${APP_CONFIG.storagePrefix}store:${baseKey}`;
};

// 状态过滤
const filterState = <T>(state: T, config: IPersistConfig): Partial<T> => {
  // whitelist 优先于 blacklist
  if (whitelist?.length) {
    return pick(state, whitelist);
  }
  if (blacklist?.length) {
    return omit(state, blacklist);
  }
  return state;
};
```

### 4. Store 工厂 (createStore.ts)

提供便捷的 Store 创建函数：

```typescript
// 创建业务 Store
const createBusinessStore = <T>(
  name: string,
  namespace: string,
  creator: StateCreator<T>,
  persistConfig?: Partial<IPersistConfig>,
) => create(persist(creator, { name, namespace, ...persistConfig }));

// 创建通用 Store
const createCommonStore = <T>(
  name: string,
  creator: StateCreator<T>,
  persistConfig?: Partial<IPersistConfig>,
) => create(persist(creator, { name, namespace: 'common', ...persistConfig }));
```

## Data Models

### AppState (通用配置)

```typescript
interface IAppState {
  theme: 'light' | 'dark' | 'system';
  language: string;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (language: string) => void;
}
```

### UserState (用户业务)

```typescript
interface IUserState {
  token: string | null;
  profile: IUserProfile | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  setProfile: (profile: IUserProfile | null) => void;
  logout: () => void;
}
```

### ScanState (扫描业务)

```typescript
interface IScanState {
  history: IScanRecord[];
  settings: IScanSettings;
  addRecord: (record: IScanRecord) => void;
  clearHistory: () => void;
  updateSettings: (settings: Partial<IScanSettings>) => void;
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Namespace Key Generation

_For any_ namespace string and key string, the generated storage key SHALL follow the format `{prefix}store:{namespace}:{key}` when namespace is provided, or `{prefix}store:{key}` when namespace is not provided.

**Validates: Requirements 1.1, 1.2**

### Property 2: Whitelist Filtering

_For any_ state object and whitelist array, the filtered state SHALL contain only the keys present in the whitelist.

**Validates: Requirements 2.1**

### Property 3: Blacklist Filtering

_For any_ state object and blacklist array (when no whitelist is provided), the filtered state SHALL contain all keys except those in the blacklist.

**Validates: Requirements 2.2**

### Property 4: Version Persistence

_For any_ persisted state with a version number, when the stored version differs from the current version, the migrate function SHALL be called with the stored state and version.

**Validates: Requirements 2.4**

### Property 5: Namespace Isolation

_For any_ two stores with different namespaces, their storage keys SHALL have different namespace prefixes, ensuring data isolation.

**Validates: Requirements 3.3**

### Property 6: Selective Namespace Clear

_For any_ set of persisted stores across multiple namespaces, clearing one namespace SHALL remove only the data for that namespace while preserving data in other namespaces.

**Validates: Requirements 4.1**

### Property 7: Complete Clear

_For any_ set of persisted stores, calling clearAllPersist SHALL remove all store data from storage.

**Validates: Requirements 4.2**

### Property 8: Hydration Merge

_For any_ initial state and persisted state, the hydrated state SHALL be a merge where persisted values override initial values for matching keys.

**Validates: Requirements 6.2**

### Property 9: Date Serialization Round-Trip

_For any_ state object containing Date instances, serializing and then deserializing SHALL produce an equivalent object with Date instances restored.

**Validates: Requirements 7.1, 7.2**

## Error Handling

| 场景         | 处理策略                                         |
| ------------ | ------------------------------------------------ |
| 存储读取失败 | 记录错误日志，使用初始状态，设置 hydrated = true |
| 存储写入失败 | 记录错误日志，抛出错误供调用方处理               |
| 序列化失败   | 记录错误日志，返回原始值                         |
| 反序列化失败 | 记录错误日志，返回 null                          |
| 版本迁移失败 | 记录错误日志，使用未迁移的状态                   |

## Testing Strategy

### 测试框架

- **单元测试**: Jest
- **属性测试**: fast-check

### 单元测试覆盖

1. **类型定义测试**

   - 验证接口类型正确性

2. **序列化器测试**

   - Date 对象序列化
   - 嵌套对象处理
   - 错误情况处理

3. **持久化中间件测试**

   - 键名生成
   - 状态过滤
   - 版本迁移

4. **Store 工厂测试**
   - 业务 Store 创建
   - 通用 Store 创建

### 属性测试覆盖

每个属性测试必须：

- 运行至少 100 次迭代
- 使用注释标注对应的正确性属性
- 格式：`**Feature: zustand-store-architecture, Property {number}: {property_text}**`

```typescript
// 示例：Property 9 测试
describe('Date Serialization Round-Trip', () => {
  // **Feature: zustand-store-architecture, Property 9: Date Serialization Round-Trip**
  it('should preserve Date objects through serialization cycle', () => {
    fc.assert(
      fc.property(fc.date(), (date) => {
        const obj = { createdAt: date };
        const serialized = serialize(obj);
        const deserialized = deserialize(serialized);
        expect(deserialized.createdAt.getTime()).toBe(date.getTime());
      }),
      { numRuns: 100 },
    );
  });
});
```
