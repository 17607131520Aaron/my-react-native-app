# CodeScanner 组件分析文档

> 📅 文档创建时间：2024-12-07
> 📁 组件路径：`src/components/CodeScanner/`

---

## 一、功能概述

CodeScanner 是一个基于 `react-native-camera-kit` 的综合条形码/二维码扫描组件，提供了完整的扫码能力，包括：

| 功能模块    | 说明                                 |
| ----------- | ------------------------------------ |
| 📷 相机扫码 | 支持条形码、二维码等多种码制         |
| 🔄 重复检测 | 自动识别重复扫码，避免重复处理       |
| ⏱️ 扫码节流 | 控制扫码频率，防止快速重复触发       |
| 💾 结果缓存 | FIFO 缓存机制，支持过期失效          |
| 📦 序列化   | 扫码结果的序列化/反序列化            |
| 🔦 手电筒   | 支持开关手电筒                       |
| 🎯 扫描框   | 可视化扫描引导覆盖层                 |
| 🔐 权限管理 | 自动处理相机权限请求                 |
| ⏸️ 生命周期 | 基于 App 状态和导航焦点自动暂停/恢复 |

---

## 二、功能明细

### 2.1 核心扫码功能

#### 支持的码制

- QR Code（二维码）
- EAN-13
- Code 128
- 其他 `react-native-camera-kit` 支持的码制

#### 扫码回调

```typescript
interface ICodeScannerProps {
  onScan: (result: IScanResult) => void; // 扫码成功回调
  onDuplicateScan?: (result: IScanResult) => void; // 重复扫码回调
  onPermissionDenied?: () => void; // 权限拒绝回调
}
```

### 2.2 重复检测机制

| 配置项                     | 类型    | 默认值 | 说明                        |
| -------------------------- | ------- | ------ | --------------------------- |
| `enableDuplicateDetection` | boolean | true   | 是否启用重复检测            |
| `allowDuplicateScan`       | boolean | false  | 重复扫码时是否仍触发 onScan |

**行为逻辑：**

- 启用重复检测时，相同码值在缓存有效期内会被识别为重复
- 重复扫码会触发 `onDuplicateScan` 回调
- 仅当 `allowDuplicateScan=true` 时，重复扫码才会同时触发 `onScan`

### 2.3 扫码节流

| 配置项         | 类型   | 默认值 | 说明                   |
| -------------- | ------ | ------ | ---------------------- |
| `scanInterval` | number | 1000ms | 两次扫码之间的最小间隔 |

### 2.4 缓存配置

```typescript
interface IScanCacheConfig {
  maxSize: number; // 缓存最大容量，默认 100
  expirationMs: number; // 缓存过期时间，默认 5 分钟
}
```

### 2.5 UI 配置

| 配置项           | 类型          | 默认值 | 说明             |
| ---------------- | ------------- | ------ | ---------------- |
| `showScanFrame`  | boolean       | true   | 是否显示扫描框   |
| `scanFrameStyle` | ViewStyle     | -      | 扫描框自定义样式 |
| `torchMode`      | 'on' \| 'off' | 'off'  | 手电筒模式       |
| `paused`         | boolean       | false  | 是否暂停扫码     |
| `style`          | ViewStyle     | -      | 容器样式         |

### 2.6 生命周期管理

组件自动处理以下场景的暂停/恢复：

- ✅ App 进入后台时自动暂停
- ✅ App 回到前台时自动恢复
- ✅ 页面失去导航焦点时自动暂停
- ✅ 页面获得导航焦点时自动恢复
- ✅ 支持外部 `paused` 属性手动控制

---

## 三、实现明细

### 3.1 文件结构

```
src/components/CodeScanner/
├── index.tsx                 # 模块导出入口
├── CodeScanner.tsx           # 主组件
├── ScanFrame.tsx             # 扫描框 UI 组件
├── ScanCache.ts              # 缓存管理类
├── ScanThrottle.ts           # 节流控制类
├── ScanResultSerializer.ts   # 序列化工具类
├── useCodeScanner.ts         # 扫码状态管理 Hook
├── useScannerLifecycle.ts    # 生命周期管理 Hook
└── types.ts                  # 类型定义
```

### 3.2 核心类实现

#### ScanCache（缓存管理）

```typescript
class ScanCache {
  private config: IScanCacheConfig;
  private cache: Map<string, ICacheEntry>;
  private insertionOrder: string[]; // 用于 FIFO 驱逐

  has(value: string): boolean; // 检查是否存在且未过期
  add(value: string): void; // 添加条目（自动驱逐）
  clear(): void; // 清空缓存
  size(): number; // 获取缓存大小
}
```

**实现特点：**

- 使用 `Map` 存储缓存条目
- 使用数组 `insertionOrder` 维护插入顺序，实现 FIFO 驱逐
- 支持基于时间的过期失效
- 达到 `maxSize` 时自动驱逐最旧条目

#### ScanThrottle（节流控制）

```typescript
class ScanThrottle {
  private intervalMs: number;
  private lastScanTimestamp: number | null;

  canScan(): boolean; // 检查是否可以扫码
  recordScan(): void; // 记录一次扫码
  reset(): void; // 重置节流状态
  getRemainingTime(): number; // 获取剩余等待时间
}
```

**实现特点：**

- 基于时间戳的简单节流实现
- 支持获取剩余等待时间
- 支持重置状态

#### ScanResultSerializer（序列化工具）

```typescript
class ScanResultSerializer {
  static serialize(result: IScanResult): string;
  static deserialize(json: string): ISerializationResult<IScanResult>;
  static serializeArray(results: IScanResult[]): string;
  static deserializeArray(json: string): ISerializationResult<IScanResult[]>;
}
```

**实现特点：**

- 静态方法，无需实例化
- 反序列化时进行类型验证
- 返回 `ISerializationResult` 包含成功/失败状态和错误信息

### 3.3 Hooks 实现

#### useCodeScanner

```typescript
function useCodeScanner(options?: IUseCodeScannerOptions): IUseCodeScannerReturn {
  // 返回值
  return {
    handleScan, // 处理扫码结果
    isDuplicate, // 检查是否重复
    clearCache, // 清除缓存
    resetThrottle, // 重置节流
    canScan, // 当前是否可扫码
  };
}
```

**实现特点：**

- 使用 `useRef` 保持 `ScanCache` 和 `ScanThrottle` 实例稳定
- 使用 `useState` 跟踪 `canScan` 状态实现响应式
- 节流过期后通过 `setTimeout` 自动更新状态

#### useScannerLifecycle

```typescript
function useScannerLifecycle(options?: IUseScannerLifecycleOptions): IUseScannerLifecycleReturn {
  // 返回值
  return {
    shouldPause, // 综合判断是否应暂停
    isAppActive, // App 是否在前台
    isFocused, // 页面是否有焦点
  };
}
```

**实现特点：**

- 使用 `AppState.addEventListener` 监听 App 状态
- 使用 `@react-navigation/native` 的 `useFocusEffect` 监听导航焦点
- 综合计算 `shouldPause = isExternalPaused || !isAppActive || !isFocused`

### 3.4 主组件实现（CodeScanner）

**权限处理流程：**

```
组件挂载
    ↓
检查权限状态 (check)
    ↓
┌─────────────────────────────────────┐
│ GRANTED → 直接使用                   │
│ DENIED → 请求权限 (request)          │
│ BLOCKED → 调用 onPermissionDenied    │
│ UNAVAILABLE → 调用 onPermissionDenied│
│ LIMITED → 直接使用 (iOS 14+)         │
└─────────────────────────────────────┘
```

**扫码处理流程：**

```
相机读取到码
    ↓
检查 shouldPause → 暂停则忽略
    ↓
检查是否重复 (isDuplicate)
    ↓
调用 handleScan 处理节流
    ↓
节流通过 → 创建 IScanResult
    ↓
┌─────────────────────────────────────┐
│ 重复扫码:                            │
│   - 触发 onDuplicateScan            │
│   - allowDuplicateScan=true 时      │
│     同时触发 onScan                  │
│ 新扫码:                              │
│   - 触发 onScan                     │
└─────────────────────────────────────┘
```

### 3.5 依赖关系

```
外部依赖：
├── react-native-camera-kit    # 相机和扫码能力
├── react-native-permissions   # 权限管理
└── @react-navigation/native   # 导航焦点监听

内部依赖关系：
CodeScanner.tsx
├── useCodeScanner.ts
│   ├── ScanCache.ts
│   └── ScanThrottle.ts
├── useScannerLifecycle.ts
├── ScanFrame.tsx
└── types.ts
```

---

## 四、数据结构

### 4.1 IScanResult（扫码结果）

```typescript
interface IScanResult {
  value: string; // 扫描到的码值
  codeType: string; // 码类型 (qr, ean13, code128 等)
  timestamp: number; // 扫描时间戳
}
```

### 4.2 ICacheEntry（缓存条目）

```typescript
interface ICacheEntry {
  value: string; // 缓存的码值
  timestamp: number; // 添加到缓存的时间戳
}
```

### 4.3 ISerializationResult（序列化结果）

```typescript
interface ISerializationResult<T> {
  success: boolean; // 操作是否成功
  data?: T; // 成功时的数据
  error?: string; // 失败时的错误信息
}
```

---

## 五、使用示例

### 5.1 基础使用

```tsx
import { CodeScanner } from '@/components/CodeScanner';

function ScanPage() {
  const handleScan = (result: IScanResult) => {
    console.log('扫码结果:', result.value);
  };

  return <CodeScanner onScan={handleScan} />;
}
```

### 5.2 完整配置

```tsx
<CodeScanner
  onScan={handleScan}
  onDuplicateScan={handleDuplicate}
  onPermissionDenied={handlePermissionDenied}
  scanInterval={500}
  enableDuplicateDetection={true}
  allowDuplicateScan={false}
  cacheConfig={{ maxSize: 50, expirationMs: 60000 }}
  paused={false}
  torchMode='off'
  showScanFrame={true}
  scanFrameStyle={{ borderColor: 'blue' }}
/>
```

### 5.3 使用 Hook

```tsx
import { useCodeScanner } from '@/components/CodeScanner';

function CustomScanner() {
  const { handleScan, isDuplicate, clearCache, canScan } = useCodeScanner({
    scanInterval: 1000,
    enableDuplicateDetection: true,
  });

  // 自定义扫码逻辑...
}
```

---

## 六、重构建议

### 6.1 潜在优化点

| 优化项   | 当前状态        | 建议                     |
| -------- | --------------- | ------------------------ |
| 缓存驱逐 | 仅在 add 时驱逐 | 可考虑定时清理过期条目   |
| 错误处理 | 基础 try-catch  | 可增加更细粒度的错误类型 |
| 测试覆盖 | 未见测试文件    | 建议添加单元测试         |
| 性能监控 | 无              | 可添加扫码性能指标收集   |

### 6.2 架构建议

1. **状态管理**：考虑将扫码状态集成到全局 store（如 `scanStore`）
2. **配置抽离**：将默认配置抽离为独立配置文件
3. **事件总线**：考虑使用事件总线解耦扫码事件处理
4. **类型增强**：为码类型定义枚举，增强类型安全

---

## 七、相关文件

- 📄 `doc/CodeScanner.md` - 原有文档
- 📁 `src/pages/ScanInboundPage/` - 扫码页面使用示例
- 📁 `src/services/scanService.ts` - 扫码服务层
- 📁 `src/store/business/scan/` - 扫码状态管理
