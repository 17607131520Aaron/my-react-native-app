# CodeScanner 扫码组件

基于 `react-native-camera-kit` 的二维码/条形码扫描组件，提供扫码缓存、重复检测、扫码节流等功能。

## 安装依赖

```bash
yarn add react-native-camera-kit
```

iOS 需要在 `Info.plist` 中添加相机权限说明：

```xml
<key>NSCameraUsageDescription</key>
<string>需要使用相机进行扫码</string>
```

## 基本用法

```tsx
import CodeScanner from '~/components/CodeScanner';

function ScanPage() {
  const handleScan = (result) => {
    console.log('扫描结果:', result.value);
    console.log('码类型:', result.codeType);
  };

  return <CodeScanner onScan={handleScan} style={{ flex: 1 }} />;
}
```

## Props

| 属性                       | 类型                            | 默认值  | 说明                        |
| -------------------------- | ------------------------------- | ------- | --------------------------- |
| `onScan`                   | `(result: IScanResult) => void` | 必填    | 扫码成功回调                |
| `onDuplicateScan`          | `(result: IScanResult) => void` | -       | 重复扫码回调                |
| `onPermissionDenied`       | `() => void`                    | -       | 相机权限被拒绝回调          |
| `scanInterval`             | `number`                        | `1000`  | 扫码时间间隔（毫秒）        |
| `enableDuplicateDetection` | `boolean`                       | `true`  | 是否启用重复检测            |
| `allowDuplicateScan`       | `boolean`                       | `false` | 重复扫码时是否仍触发 onScan |
| `cacheConfig`              | `Partial<IScanCacheConfig>`     | -       | 缓存配置                    |
| `paused`                   | `boolean`                       | `false` | 是否暂停扫码                |
| `torchMode`                | `'on' \| 'off'`                 | `'off'` | 手电筒模式                  |
| `showScanFrame`            | `boolean`                       | `true`  | 是否显示扫描框              |
| `scanFrameStyle`           | `ViewStyle`                     | -       | 扫描框样式                  |
| `style`                    | `ViewStyle`                     | -       | 容器样式                    |

## 类型定义

### IScanResult

```typescript
interface IScanResult {
  value: string; // 扫描到的码值
  codeType: string; // 码类型 (qr, ean13, code128 等)
  timestamp: number; // 扫描时间戳
}
```

### IScanCacheConfig

```typescript
interface IScanCacheConfig {
  maxSize: number; // 缓存最大容量，默认 100
  expirationMs: number; // 缓存过期时间（毫秒），默认 5 分钟
}
```

## 使用示例

### 带重复检测提示

```tsx
import CodeScanner from '~/components/CodeScanner';
import { Alert } from 'react-native';

function ScanPage() {
  const handleScan = (result) => {
    // 处理新扫码
    console.log('新扫码:', result.value);
  };

  const handleDuplicateScan = (result) => {
    Alert.alert('提示', `该码已扫描过: ${result.value}`);
  };

  return (
    <CodeScanner onScan={handleScan} onDuplicateScan={handleDuplicateScan} style={{ flex: 1 }} />
  );
}
```

### 自定义缓存配置

```tsx
<CodeScanner
  onScan={handleScan}
  cacheConfig={{
    maxSize: 50, // 最多缓存 50 个码
    expirationMs: 60000, // 1 分钟后过期
  }}
  style={{ flex: 1 }}
/>
```

### 控制扫码间隔

```tsx
<CodeScanner
  onScan={handleScan}
  scanInterval={2000} // 两次扫码间隔至少 2 秒
  style={{ flex: 1 }}
/>
```

### 暂停/恢复扫码

```tsx
function ScanPage() {
  const [paused, setPaused] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <CodeScanner onScan={handleScan} paused={paused} style={{ flex: 1 }} />
      <Button title={paused ? '恢复扫码' : '暂停扫码'} onPress={() => setPaused(!paused)} />
    </View>
  );
}
```

### 手电筒控制

```tsx
function ScanPage() {
  const [torch, setTorch] = useState<'on' | 'off'>('off');

  return (
    <View style={{ flex: 1 }}>
      <CodeScanner onScan={handleScan} torchMode={torch} style={{ flex: 1 }} />
      <Button
        title={torch === 'on' ? '关闭手电筒' : '打开手电筒'}
        onPress={() => setTorch(torch === 'on' ? 'off' : 'on')}
      />
    </View>
  );
}
```

### 自定义扫描框样式

```tsx
<CodeScanner
  onScan={handleScan}
  showScanFrame={true}
  scanFrameStyle={{
    width: 300,
    height: 300,
    borderColor: '#FF0000',
  }}
  style={{ flex: 1 }}
/>
```

## 高级用法

### 使用 useCodeScanner Hook

如果需要更细粒度的控制，可以直接使用 `useCodeScanner` hook：

```tsx
import { useCodeScanner } from '~/components/CodeScanner';

function CustomScanner() {
  const { handleScan, isDuplicate, clearCache, resetThrottle, canScan } = useCodeScanner({
    scanInterval: 1000,
    cacheConfig: { maxSize: 50 },
    enableDuplicateDetection: true,
  });

  // 手动处理扫码
  const onCodeDetected = (value: string, codeType: string) => {
    if (isDuplicate(value)) {
      console.log('重复扫码');
      return;
    }

    const result = handleScan(value, codeType);
    if (result) {
      console.log('扫码成功:', result);
    }
  };

  return (
    <View>
      {/* 自定义相机实现 */}
      <Button title='清除缓存' onPress={clearCache} />
      <Button title='重置节流' onPress={resetThrottle} />
      <Text>可以扫码: {canScan ? '是' : '否'}</Text>
    </View>
  );
}
```

### 使用 ScanCache 类

```tsx
import { ScanCache } from '~/components/CodeScanner';

const cache = new ScanCache({
  maxSize: 100,
  expirationMs: 300000, // 5 分钟
});

// 添加码值
cache.add('ABC123');

// 检查是否存在
if (cache.has('ABC123')) {
  console.log('码值已缓存');
}

// 获取缓存大小
console.log('缓存数量:', cache.size());

// 清除缓存
cache.clear();
```

### 使用 ScanThrottle 类

```tsx
import { ScanThrottle } from '~/components/CodeScanner';

const throttle = new ScanThrottle(1000); // 1 秒间隔

if (throttle.canScan()) {
  // 执行扫码
  throttle.recordScan();
}

// 获取剩余等待时间
console.log('剩余时间:', throttle.getRemainingTime());

// 重置节流
throttle.reset();
```

### 序列化扫码结果

```tsx
import { ScanResultSerializer } from '~/components/CodeScanner';
import type { IScanResult } from '~/components/CodeScanner';

const result: IScanResult = {
  value: 'ABC123',
  codeType: 'qr',
  timestamp: Date.now(),
};

// 序列化
const json = ScanResultSerializer.serialize(result);

// 反序列化
const parsed = ScanResultSerializer.deserialize(json);
if (parsed.success) {
  console.log('解析成功:', parsed.data);
} else {
  console.log('解析失败:', parsed.error);
}

// 数组序列化
const results = [result];
const arrayJson = ScanResultSerializer.serializeArray(results);
const parsedArray = ScanResultSerializer.deserializeArray(arrayJson);
```

## 导出内容

```tsx
// 主组件
import CodeScanner from '~/components/CodeScanner';

// 命名导出
import {
  CodeScanner, // 扫码组件
  ScanFrame, // 扫描框组件
  ScanCache, // 缓存类
  ScanThrottle, // 节流类
  ScanResultSerializer, // 序列化工具
  useCodeScanner, // Hook
} from '~/components/CodeScanner';

// 类型导出
import type {
  IScanResult,
  IScanCacheConfig,
  ICacheEntry,
  ISerializationResult,
  ICodeScannerProps,
  IUseCodeScannerOptions,
  IUseCodeScannerReturn,
} from '~/components/CodeScanner';
```
