# Requirements Document

## Introduction

本文档定义了 React Native 应用中 Zustand 状态管理架构的需求规范。该架构旨在提供一个可配置的持久化方案，支持按命名空间隔离存储，并将业务状态与通用配置分离管理。

## Glossary

- **Zustand**: 一个轻量级的 React 状态管理库
- **Store**: Zustand 中的状态容器，包含状态数据和操作方法
- **Namespace（命名空间）**: 用于隔离不同业务模块存储数据的标识符
- **Persist（持久化）**: 将状态数据保存到本地存储，应用重启后可恢复
- **Business Store（业务 Store）**: 存储特定业务逻辑相关状态的 Store
- **Common Store（通用 Store）**: 存储应用级通用配置的 Store
- **Hydration（水合）**: 从持久化存储中恢复状态到内存的过程
- **Whitelist（白名单）**: 指定需要持久化的字段列表
- **Blacklist（黑名单）**: 指定不需要持久化的字段列表
- **Serializer（序列化器）**: 将状态对象转换为可存储字符串的工具

## Requirements

### Requirement 1

**User Story:** 作为开发者，我希望能够按命名空间组织和隔离状态存储，以便不同业务模块的数据互不干扰。

#### Acceptance Criteria

1. WHEN 创建一个带有命名空间的 Store THEN 系统 SHALL 使用格式 `{prefix}store:{namespace}:{key}` 生成存储键名
2. WHEN 创建一个不带命名空间的 Store THEN 系统 SHALL 使用格式 `{prefix}store:{key}` 生成存储键名
3. WHEN 多个 Store 使用相同命名空间但不同 key THEN 系统 SHALL 将它们存储在同一命名空间下的不同键中

### Requirement 2

**User Story:** 作为开发者，我希望能够灵活配置哪些状态字段需要持久化，以便控制存储大小和敏感数据。

#### Acceptance Criteria

1. WHEN 配置了 whitelist THEN 系统 SHALL 仅持久化 whitelist 中指定的字段
2. WHEN 配置了 blacklist THEN 系统 SHALL 持久化除 blacklist 中指定字段外的所有字段
3. WHEN 同时配置了 whitelist 和 blacklist THEN 系统 SHALL 优先使用 whitelist 规则
4. WHEN 配置了 version 且存储的版本与当前版本不同 THEN 系统 SHALL 调用 migrate 函数进行数据迁移

### Requirement 3

**User Story:** 作为开发者，我希望业务状态与通用配置能够分离存储，以便独立管理和清理。

#### Acceptance Criteria

1. WHEN 创建业务 Store THEN 系统 SHALL 将其归类到 business 目录下并使用业务相关的命名空间
2. WHEN 创建通用 Store THEN 系统 SHALL 将其归类到 common 目录下并使用 'common' 命名空间
3. WHEN 清理特定命名空间数据 THEN 系统 SHALL 仅删除该命名空间下的所有存储数据，不影响其他命名空间

### Requirement 4

**User Story:** 作为开发者，我希望能够按命名空间清理持久化数据，以便在用户登出或数据重置时精确控制。

#### Acceptance Criteria

1. WHEN 调用 clearPersistByNamespace 函数 THEN 系统 SHALL 删除指定命名空间下的所有持久化数据
2. WHEN 调用 clearAllPersist 函数 THEN 系统 SHALL 删除所有 Store 的持久化数据
3. WHEN 清理操作发生错误 THEN 系统 SHALL 抛出错误并记录日志

### Requirement 5

**User Story:** 作为开发者，我希望能够追踪状态的水合状态，以便在 UI 中正确处理加载状态。

#### Acceptance Criteria

1. WHEN Store 开始从存储恢复状态 THEN 系统 SHALL 将 hydrated 状态设置为 false
2. WHEN Store 完成状态恢复 THEN 系统 SHALL 将 hydrated 状态设置为 true
3. WHEN 状态恢复失败 THEN 系统 SHALL 将 hydrated 状态设置为 true 并使用初始状态

### Requirement 6

**User Story:** 作为开发者，我希望持久化中间件能够正确处理状态的保存和恢复，以便应用重启后状态能够正确恢复。

#### Acceptance Criteria

1. WHEN 状态发生变化 THEN 系统 SHALL 将过滤后的状态序列化并保存到 AsyncStorage
2. WHEN 应用启动并恢复状态 THEN 系统 SHALL 将持久化的状态与初始状态合并
3. WHEN 存储或恢复操作失败 THEN 系统 SHALL 记录错误日志并继续运行

### Requirement 7

**User Story:** 作为开发者，我希望序列化器能够正确处理特殊数据类型，以便 Date 等对象能够正确持久化和恢复。

#### Acceptance Criteria

1. WHEN 序列化包含 Date 对象的状态 THEN 系统 SHALL 将 Date 转换为 ISO 字符串格式
2. WHEN 反序列化包含日期字符串的状态 THEN 系统 SHALL 将 ISO 字符串还原为 Date 对象
3. WHEN 序列化或反序列化失败 THEN 系统 SHALL 记录错误并返回原始值或 null
