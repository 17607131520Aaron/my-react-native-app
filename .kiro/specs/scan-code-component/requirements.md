# 需求文档

## 简介

本文档定义了基于 `react-native-camera-kit` 库实现的扫码组件需求。该组件需要提供与 asp-smartservice-app 项目中 ScanCode 组件相同的核心能力，并新增扫码缓存和频率控制功能。组件将用于仓库管理、物料扫描、调拨单处理等业务场景。

## 术语表

- **ScanCode**: 扫码组件，用于识别二维码和条形码
- **条码缓存**: 已扫描条码的临时存储机制，用于防止重复扫描
- **扫码频率控制**: 控制连续扫码之间的时间间隔，防止过快扫码
- **扫码区域**: 相机预览中用于识别条码的有效区域
- **快速扫码模式**: 支持同时识别多个码并根据位置排序的扫码模式
- **结果过滤**: 通过正则表达式对扫码结果进行筛选
- **页面焦点**: 扫码页面是否处于前台活跃状态
- **应用状态**: 应用是否处于前台运行状态

## 需求

### 需求 1

**用户故事:** 作为开发者，我希望能够在应用中集成扫码功能，以便用户可以扫描二维码和条形码。

#### 验收标准

1. WHEN 组件挂载时 THE ScanCode 组件 SHALL 自动请求相机权限
2. WHEN 相机权限被授予时 THE ScanCode 组件 SHALL 显示相机预览画面
3. WHEN 相机权限被拒绝时 THE ScanCode 组件 SHALL 调用 onCameraPermissionDenied 回调函数
4. WHEN 相机打开失败时 THE ScanCode 组件 SHALL 调用 onCameraError 回调函数并传递错误信息

### 需求 2

**用户故事:** 作为开发者，我希望组件支持多种条码格式，以便满足不同业务场景的扫码需求。

#### 验收标准

1. THE ScanCode 组件 SHALL 支持以下条码格式：QR Code、EAN-13、EAN-8、Code 128、Code 39、Code 93、UPC-A、UPC-E、PDF417、Codabar
2. WHEN 开发者通过 codeTypes 属性指定条码格式时 THE ScanCode 组件 SHALL 仅识别指定格式的条码
3. WHEN 开发者未指定 codeTypes 属性时 THE ScanCode 组件 SHALL 使用默认格式列表（QR Code、EAN-13、Code 128、Code 39）

### 需求 3

**用户故事:** 作为开发者，我希望能够控制扫码区域，以便提高扫码准确性和用户体验。

#### 验收标准

1. WHEN 开发者通过 scanArea 属性指定扫描区域时 THE ScanCode 组件 SHALL 仅在指定区域内识别条码
2. WHEN needLimitArea 属性为 true 时 THE ScanCode 组件 SHALL 过滤掉扫描区域外的识别结果
3. WHEN 识别到多个条码时 THE ScanCode 组件 SHALL 按照与扫描区域中心点的距离进行排序，距离最近的优先返回

### 需求 4

**用户故事:** 作为开发者，我希望能够通过正则表达式过滤扫码结果，以便只获取符合业务规则的条码。

#### 验收标准

1. WHEN 开发者通过 includePatterns 属性指定包含正则时 THE ScanCode 组件 SHALL 仅返回匹配任一正则的扫码结果
2. WHEN 开发者通过 excludePatterns 属性指定排除正则时 THE ScanCode 组件 SHALL 过滤掉匹配任一正则的扫码结果
3. WHEN 同时指定 includePatterns 和 excludePatterns 时 THE ScanCode 组件 SHALL 先执行排除过滤再执行包含过滤

### 需求 5

**用户故事:** 作为开发者，我希望组件提供扫码缓存功能，以便防止短时间内重复处理同一条码。

#### 验收标准

1. WHEN 成功扫描一个条码时 THE ScanCode 组件 SHALL 将该条码添加到缓存中
2. WHEN 扫描到已缓存的条码时 THE ScanCode 组件 SHALL 调用 onCachedCodeScanned 回调而非 onCodeScanned 回调
3. WHEN 缓存时间超过 cacheTimeout 设定值时 THE ScanCode 组件 SHALL 自动从缓存中移除该条码
4. WHEN 开发者调用 clearCache 方法时 THE ScanCode 组件 SHALL 清空所有缓存的条码
5. WHEN 开发者调用 removeFromCache 方法并传入条码时 THE ScanCode 组件 SHALL 从缓存中移除指定条码

### 需求 6

**用户故事:** 作为开发者，我希望能够控制扫码频率，以便防止过快扫码导致的性能问题和重复处理。

#### 验收标准

1. WHEN 成功扫描一个条码后 THE ScanCode 组件 SHALL 在 scanInterval 指定的时间内禁用扫码
2. WHEN 开发者调用 pauseScanning 方法时 THE ScanCode 组件 SHALL 暂停扫码功能
3. WHEN 开发者调用 resumeScanning 方法时 THE ScanCode 组件 SHALL 恢复扫码功能
4. WHEN 扫码被暂停期间识别到条码时 THE ScanCode 组件 SHALL 忽略该识别结果

### 需求 7

**用户故事:** 作为用户，我希望在扫码时获得视觉和触觉反馈，以便确认扫码操作已被识别。

#### 验收标准

1. WHEN enableVibration 属性为 true 且成功扫描条码时 THE ScanCode 组件 SHALL 触发设备震动
2. WHEN enableFlashlight 属性为 true 时 THE ScanCode 组件 SHALL 开启闪光灯
3. WHEN showScanAnimation 属性为 true 时 THE ScanCode 组件 SHALL 显示扫描动画效果
4. WHEN 开发者调用 toggleFlashlight 方法时 THE ScanCode 组件 SHALL 切换闪光灯状态

### 需求 8

**用户故事:** 作为开发者，我希望组件提供完整的扫码结果信息，以便进行后续业务处理。

#### 验收标准

1. WHEN 成功扫描条码时 THE ScanCode 组件 SHALL 通过 onCodeScanned 回调返回包含 data、type、timestamp 字段的结果对象
2. WHEN 启用快速扫码模式且识别到多个条码时 THE ScanCode 组件 SHALL 通过 onMultipleCodesScanned 回调返回所有识别结果的数组
3. WHEN 扫码超时时 THE ScanCode 组件 SHALL 调用 onScanTimeout 回调函数

### 需求 9

**用户故事:** 作为开发者，我希望能够自定义扫码组件的外观，以便与应用整体风格保持一致。

#### 验收标准

1. WHEN 开发者通过 style 属性传入样式时 THE ScanCode 组件 SHALL 将样式应用到容器视图
2. WHEN 开发者通过 maskColor 属性指定遮罩颜色时 THE ScanCode 组件 SHALL 使用指定颜色渲染扫描区域外的遮罩
3. WHEN 开发者通过 children 属性传入子组件时 THE ScanCode 组件 SHALL 在相机预览上层渲染这些子组件

### 需求 10

**用户故事:** 作为开发者，我希望组件能够根据页面焦点和应用状态自动管理扫码功能，以便节省资源并避免后台扫码。

#### 验收标准

1. WHEN 扫码页面失去焦点时 THE ScanCode 组件 SHALL 自动暂停扫码功能
2. WHEN 扫码页面重新获得焦点时 THE ScanCode 组件 SHALL 自动恢复扫码功能
3. WHEN 应用进入后台时 THE ScanCode 组件 SHALL 自动暂停扫码功能并关闭闪光灯
4. WHEN 应用从后台返回前台时 THE ScanCode 组件 SHALL 自动恢复扫码功能
5. WHEN isActive 属性为 false 时 THE ScanCode 组件 SHALL 暂停扫码功能并停止相机预览
6. WHEN isActive 属性从 false 变为 true 时 THE ScanCode 组件 SHALL 恢复扫码功能并重新启动相机预览

### 需求 11

**用户故事:** 作为开发者，我希望组件在生命周期结束时正确清理资源，以便避免内存泄漏。

#### 验收标准

1. WHEN 组件卸载时 THE ScanCode 组件 SHALL 关闭闪光灯
2. WHEN 组件卸载时 THE ScanCode 组件 SHALL 清除所有定时器
3. WHEN 组件卸载时 THE ScanCode 组件 SHALL 清空条码缓存
4. WHEN 组件卸载时 THE ScanCode 组件 SHALL 移除应用状态监听器
