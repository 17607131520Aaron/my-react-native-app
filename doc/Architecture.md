# 项目架构文档

## 概述

这是一个 React Native 移动应用项目，采用 TypeScript 开发，支持 iOS 和 Android 双平台。项目使用 Zustand 进行状态管理，支持基于角色的导航系统和完整的主题切换功能。

## 技术栈

- **框架**: React Native
- **语言**: TypeScript
- **状态管理**: Zustand + 自定义持久化中间件
- **导航**: React Navigation (Bottom Tab Navigator)
- **网络请求**: Axios
- **存储**: AsyncStorage
- **代码规范**: ESLint + Prettier

## 目录结构

```
src/
├── app/              # 应用入口和导航配置
├── assets/           # 静态资源（图片、字体等）
├── common/           # 通用配置和常量
├── components/       # UI 组件
├── contexts/         # React Context（预留）
├── hooks/            # 自定义 Hooks（预留）
├── modules/          # 业务模块（预留）
├── pages/            # 页面组件
├── routers/          # 路由/屏幕配置
├── services/         # API 服务层
├── store/            # Zustand 状态管理
├── theme/            # 主题系统
├── types/            # 全局类型定义
└── utils/            # 工具函数
```

## 各目录详解

### `src/app/` - 应用入口

应用的根组件和导航配置。

| 文件            | 说明                                                     |
| --------------- | -------------------------------------------------------- |
| `index.tsx`     | App 根组件，包含 ErrorBoundary、ThemeProvider 和导航容器 |
| `tabConfigs.ts` | 基于角色的 Tab 配置，定义不同角色看到的底部导航          |
| `types.ts`      | 导航相关类型定义                                         |

**角色导航机制**：

- `engineer` - 工程师角色：工作台 + 我的
- `institution` - 机构角色：机构 + 我的
- `admin` - 管理员角色：工作台 + 机构 + 我的

### `src/common/` - 通用配置

全局配置和常量定义。

| 文件        | 说明                                       |
| ----------- | ------------------------------------------ |
| `config.ts` | 应用配置（API 地址、存储前缀、重试次数等） |
| `env.ts`    | 环境变量封装，提供类型安全的环境配置访问   |
| `colors.ts` | 基础颜色常量（建议迁移到 theme 系统）      |

**环境支持**：`development` / `test` / `pre` / `production`

### `src/components/` - UI 组件

可复用的 UI 组件，按功能模块组织。

```
components/
├── CodeScanner/      # 扫码组件模块
│   ├── CodeScanner.tsx       # 主组件
│   ├── ScanCache.ts          # 扫码缓存（去重）
│   ├── ScanFrame.tsx         # 扫码框 UI
│   ├── ScanThrottle.ts       # 扫码节流
│   ├── ScanResultSerializer.ts # 结果序列化
│   ├── useCodeScanner.ts     # 扫码 Hook
│   ├── useScannerLifecycle.ts # 生命周期 Hook
│   ├── types.ts              # 类型定义
│   └── index.tsx             # 统一导出
├── MediaPreview/     # 媒体预览（预留）
├── Modal/            # 弹窗组件（预留）
└── shared/           # 共享组件
    └── ErrorBoundary/  # 错误边界组件
```

**组件设计原则**：

- 每个复杂组件独立文件夹
- 包含 types.ts 定义类型
- 通过 index.tsx 统一导出
- 逻辑抽离到自定义 Hooks

### `src/pages/` - 页面组件

业务页面，每个页面一个文件夹。

```
pages/
├── About/            # 关于页面
├── Login/            # 登录页面
└── ScanInboundPage/  # 扫码入库页面
    ├── index.tsx         # 页面组件
    └── index.style.ts    # 样式文件
```

### `src/routers/` - 路由配置

屏幕组件和导航配置。

| 文件             | 说明           |
| ---------------- | -------------- |
| `index.tsx`      | 路由统一导出   |
| `engineer.ts`    | 工程师相关屏幕 |
| `institution.ts` | 机构相关屏幕   |
| `mine.ts`        | 个人中心屏幕   |
| `navigation.ts`  | 导航工具函数   |
| `types.ts`       | 导航类型定义   |

### `src/services/` - API 服务层

封装后端 API 调用，按业务领域划分。

| 文件             | 说明                                         |
| ---------------- | -------------------------------------------- |
| `index.ts`       | 统一导出                                     |
| `types.ts`       | 通用响应类型（IApiResponse, IPageParams 等） |
| `userService.ts` | 用户相关 API（登录、登出、获取资料）         |
| `scanService.ts` | 扫码相关 API（上传结果、获取历史）           |

**使用示例**：

```typescript
import { userService } from '~/services';

const result = await userService.login({ username, password });
```

### `src/store/` - 状态管理

基于 Zustand 的状态管理系统，支持持久化和命名空间。

```
store/
├── index.ts          # 统一导出
├── core/             # 核心功能
│   ├── createStore.ts    # Store 工厂函数
│   ├── persist.ts        # 持久化中间件
│   ├── persistConfig.ts  # 持久化配置
│   ├── serializer.ts     # 序列化器
│   └── types.ts          # 类型定义
├── common/           # 通用 Store
│   └── appStore.ts       # 应用配置（主题、语言）
└── business/         # 业务 Store
    ├── user/             # 用户状态
    │   └── userStore.ts
    └── scan/             # 扫码状态
        └── scanStore.ts
```

**Store 类型**：

- `createBusinessStore` - 业务 Store，带命名空间持久化
- `createCommonStore` - 通用 Store，全局持久化
- `createPlainStore` - 普通 Store，不持久化

**使用示例**：

```typescript
import { useUserStore, useAppStore } from '~/store';

// 在组件中
const { role, setRole } = useUserStore();
const { theme, setTheme } = useAppStore();
```

### `src/theme/` - 主题系统

完整的主题管理系统，支持亮色/暗色/跟随系统。

| 文件               | 说明                                              |
| ------------------ | ------------------------------------------------- |
| `index.ts`         | 统一导出                                          |
| `types.ts`         | 主题类型定义（IColors, ISpacing, ITypography 等） |
| `colors.ts`        | 颜色配置（lightColors, darkColors）               |
| `spacing.ts`       | 间距配置                                          |
| `typography.ts`    | 字体配置                                          |
| `shadows.ts`       | 阴影配置                                          |
| `themes.ts`        | 完整主题对象                                      |
| `ThemeContext.tsx` | 主题 Context 和 Provider                          |
| `useTheme.ts`      | 主题 Hook                                         |

**使用示例**：

```typescript
import { useTheme } from '~/theme';

const { theme, themeMode, setThemeMode } = useTheme();
// theme.colors.primary, theme.spacing.md, etc.
```

### `src/utils/` - 工具函数

通用工具函数集合。

| 文件         | 说明                                               |
| ------------ | -------------------------------------------------- |
| `request.ts` | HTTP 请求封装（Axios），支持重试、离线队列、拦截器 |
| `network.ts` | 网络状态监听                                       |
| `storage.ts` | AsyncStorage 封装                                  |
| `logger.ts`  | 日志系统，支持级别过滤和彩色输出                   |

### `src/types/` - 全局类型

全局 TypeScript 类型定义。

| 文件           | 说明         |
| -------------- | ------------ |
| `request.d.ts` | 请求相关类型 |

## 开发指南

### 环境准备

1. 安装依赖：

```bash
yarn install
```

2. iOS 依赖安装：

```bash
cd ios && pod install && cd ..
```

3. 配置环境变量：
   - `.env.development` - 开发环境
   - `.env.test` - 测试环境
   - `.env.production` - 生产环境

### 启动开发

```bash
# iOS
yarn ios

# Android
yarn android
```

### 添加新页面

1. 在 `src/pages/` 创建页面文件夹：

```
src/pages/NewPage/
├── index.tsx
└── index.style.ts
```

2. 在 `src/routers/` 对应文件中注册屏幕

3. 如需添加到 Tab 导航，修改 `src/app/tabConfigs.ts`

### 添加新组件

1. 在 `src/components/` 创建组件文件夹：

```
src/components/MyComponent/
├── MyComponent.tsx
├── types.ts
└── index.tsx
```

2. 复杂逻辑抽离到 `useXxx.ts` Hook

3. 在 `index.tsx` 统一导出

### 添加新 Store

1. 在 `src/store/business/` 创建 Store：

```typescript
// src/store/business/order/orderStore.ts
import { createBusinessStore } from '../../core/createStore';

export interface IOrderState extends Record<string, unknown> {
  orders: IOrder[];
  addOrder: (order: IOrder) => void;
}

export const useOrderStore = createBusinessStore<IOrderState>(
  'order', // Store 名称
  'order', // 命名空间
  (set) => ({
    orders: [],
    addOrder: (order) =>
      set((state) => ({
        orders: [...state.orders, order],
      })),
  }),
);
```

2. 在 `src/store/business/index.ts` 导出

3. 在 `src/store/index.ts` 统一导出

### 添加新 API 服务

1. 在 `src/services/` 创建服务文件：

```typescript
// src/services/orderService.ts
import { get, post } from '~/utils/request';

export const orderService = {
  getOrders: () => get({ url: '/orders' }),
  createOrder: (data) => post({ url: '/orders', data }),
};
```

2. 在 `src/services/index.ts` 导出

## 代码规范

### 命名约定

- 文件名：`camelCase.ts` 或 `PascalCase.tsx`（组件）
- 接口：`I` 前缀，如 `IUserProfile`
- 类型：`T` 前缀，如 `TUserRole`
- 常量：`UPPER_SNAKE_CASE`

### 导入路径

使用 `~` 别名指向 `src/`：

```typescript
import { useUserStore } from '~/store';
import { userService } from '~/services';
```

### 组件结构

```typescript
/**
 * 组件说明
 */

import React from 'react';
// 外部依赖

import { xxx } from '~/xxx';
// 内部依赖

import type { IProps } from './types';
// 类型导入

// ==================== 样式 ====================
const styles = StyleSheet.create({...});

// ==================== 组件 ====================
export const MyComponent: React.FC<IProps> = (props) => {
  // ...
};
```

## 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                         App Entry                            │
│                    (ErrorBoundary + ThemeProvider)           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Navigation (Tab Navigator)                │
│              (基于角色动态配置 Tab)                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         Pages                                │
│                    (业务页面组件)                             │
└─────────────────────────────────────────────────────────────┘
          │                   │                    │
          ▼                   ▼                    ▼
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  Components │      │    Store    │      │  Services   │
│  (UI 组件)  │      │ (Zustand)   │      │  (API 层)   │
└─────────────┘      └─────────────┘      └─────────────┘
                              │                    │
                              ▼                    ▼
                     ┌─────────────┐      ┌─────────────┐
                     │   Persist   │      │   Request   │
                     │ (AsyncStorage)│    │   (Axios)   │
                     └─────────────┘      └─────────────┘
```

# Debug 版本（开发调试用）

python scripts/build_android.py

# Release 版本（正式发布用）

python scripts/build_android.py --release

# 清理缓存后构建

python scripts/build_android.py --clean

# 构建并自动安装到手机

python scripts/build_android.py --install

# 组合使用

python scripts/build_android.py --release --clean --install

## 注意事项

1. **状态持久化**：业务 Store 默认持久化，注意敏感数据处理
2. **网络请求**：支持离线队列，网络恢复后自动重发
3. **错误处理**：顶层 ErrorBoundary 捕获渲染错误
4. **主题切换**：使用 `useTheme()` 获取当前主题，避免硬编码颜色
5. **日志输出**：生产环境自动过滤 debug 日志
