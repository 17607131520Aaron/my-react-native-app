# 项目目录结构说明

本项目采用大厂前端规范（参考蚂蚁金服、阿里巴巴、字节跳动等）进行目录组织。

## 目录结构

```
src/
├── app/              # 应用入口和核心配置
│   └── App.tsx       # 应用主组件
├── pages/            # 页面组件（按功能模块划分）
├── components/       # 通用组件（可复用的 UI 组件）
├── navigation/       # 路由导航配置
│   └── index.tsx     # 导航容器和路由定义
├── services/         # API 服务层
│   └── index.ts      # API 请求封装
├── stores/           # 状态管理（如 Redux、Zustand 等）
├── utils/            # 工具函数
│   ├── index.ts      # 通用工具函数
│   └── storage.ts    # 本地存储工具
├── types/            # TypeScript 类型定义
│   └── index.ts      # 全局类型和接口
└── constants/        # 常量定义
    └── index.ts      # 应用常量
```

## 命名规范

### 文件和目录命名
- **组件文件**: 使用 PascalCase，如 `UserProfile.tsx`
- **工具文件**: 使用 camelCase，如 `formatDate.ts`
- **常量文件**: 使用 camelCase，如 `apiConfig.ts`
- **目录名**: 使用小写字母，多个单词用连字符，如 `user-profile/`

### 代码规范
- 遵循 ESLint 和 Prettier 配置
- 使用 TypeScript 进行类型检查
- 组件使用函数式组件和 Hooks
- 优先使用命名导出（named exports）

## 已安装的插件

### 路由
- `@react-navigation/native` - React Navigation 核心库
- `@react-navigation/stack` - 堆栈导航
- `@react-navigation/bottom-tabs` - 底部标签导航
- `@react-navigation/native-stack` - 原生堆栈导航
- `react-native-screens` - 原生屏幕支持
- `react-native-gesture-handler` - 手势处理

### 本地存储
- `@react-native-async-storage/async-storage` - 异步存储

### WebView
- `react-native-webview` - WebView 组件

## 使用示例

### 使用路由导航
```typescript
import { AppNavigator } from './src/navigation';

// 在 App.tsx 中使用
<AppNavigator />
```

### 使用本地存储
```typescript
import { setStorage, getStorage } from './src/utils/storage';
import { STORAGE_KEYS } from './src/constants';

// 存储数据
await setStorage(STORAGE_KEYS.USER_TOKEN, 'token123');

// 获取数据
const token = await getStorage<string>(STORAGE_KEYS.USER_TOKEN);
```

### 使用 API 服务
```typescript
import { get, post } from './src/services';

// GET 请求
const response = await get<UserInfo>('/user/info');

// POST 请求
const result = await post<ApiResponse>('/user/login', { username, password });
```

