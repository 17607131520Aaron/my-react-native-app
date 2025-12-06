# 实现计划

- [x] 1. 创建日志系统

  - [x] 1.1 创建日志类型定义和核心实现
    - 创建 `src/utils/logger.ts`
    - 实现 TLogLevel、ILogEntry、ILogger 接口
    - 实现 debug、info、warn、error 方法
    - 支持时间戳和上下文数据
    - 根据 **DEV** 环境过滤 debug 日志
    - _需求: 3.1, 3.2, 3.4_
  - [x] 1.2 编写日志格式一致性属性测试
    - **属性 2: 日志输出格式一致性**
    - **验证需求: 3.2**
  - [x] 1.3 更新 request.ts 集成日志系统
    - 替换 console.log 为 logger.info
    - 替换 console.error 为 logger.error
    - _需求: 3.5_

- [x] 2. 创建主题系统

  - [x] 2.1 创建主题类型定义
    - 创建 `src/theme/types.ts`
    - 定义 IColors、ISpacing、ITypography、IShadows、ITheme 接口
    - _需求: 4.1_
  - [x] 2.2 创建颜色、间距、字体、阴影配置
    - 创建 `src/theme/colors.ts` - 亮色和暗色颜色配置
    - 创建 `src/theme/spacing.ts` - 间距配置
    - 创建 `src/theme/typography.ts` - 字体配置
    - 创建 `src/theme/shadows.ts` - 阴影配置
    - _需求: 4.1_
  - [x] 2.3 创建主题配置和 Context
    - 创建 `src/theme/themes.ts` - lightTheme 和 darkTheme
    - 创建 `src/theme/ThemeContext.tsx` - ThemeProvider 组件
    - 集成 useColorScheme 监听系统主题
    - 集成 appStore 的 theme 状态
    - _需求: 4.2, 4.3, 4.4_
  - [x] 2.4 创建 useTheme hook 和统一导出
    - 创建 `src/theme/useTheme.ts`
    - 创建 `src/theme/index.ts` 统一导出
    - _需求: 4.2_
  - [x] 2.5 编写主题响应性属性测试
    - **属性 3: 主题响应性**
    - **验证需求: 4.3**

- [x] 3. 检查点 - 确保所有测试通过

  - 确保所有测试通过，如有问题请询问用户。

- [x] 4. 创建错误边界组件

  - [x] 4.1 创建错误边界类型和组件
    - 创建 `src/components/shared/ErrorBoundary/types.ts`
    - 创建 `src/components/shared/ErrorBoundary/ErrorBoundary.tsx`
    - 实现 getDerivedStateFromError 和 componentDidCatch
    - 集成 logger 记录错误
    - _需求: 2.1, 2.2_
  - [x] 4.2 创建默认降级 UI 和重试机制
    - 创建 `src/components/shared/ErrorBoundary/ErrorFallback.tsx`
    - 实现重试按钮和错误信息展示
    - _需求: 2.3_
  - [x] 4.3 创建统一导出和 shared 组件索引
    - 创建 `src/components/shared/ErrorBoundary/index.ts`
    - 创建 `src/components/shared/index.ts`
    - _需求: 6.2_
  - [x] 4.4 编写错误边界属性测试
    - **属性 1: 错误边界捕获所有子组件错误**
    - **验证需求: 2.1**

- [x] 5. 创建 API 服务层

  - [x] 5.1 创建服务层类型定义
    - 创建 `src/services/types.ts`
    - 定义 IApiResponse、IPageParams、IPageResponse 接口
    - _需求: 1.4_
  - [x] 5.2 创建用户服务
    - 创建 `src/services/userService.ts`
    - 实现 login、getProfile、logout、updateProfile 方法
    - _需求: 1.1, 1.2, 1.3_
  - [x] 5.3 创建扫描服务
    - 创建 `src/services/scanService.ts`
    - 实现 uploadScanResult、getScanHistory 方法
    - _需求: 1.1, 1.2, 1.3_
  - [x] 5.4 创建服务层统一导出
    - 创建 `src/services/index.ts`
    - _需求: 6.1_

- [x] 6. 优化环境配置

  - [x] 6.1 安装 react-native-config 依赖
    - 添加 react-native-config 到 package.json
    - _需求: 5.1_
  - [x] 6.2 创建环境配置文件
    - 创建 `.env.development`
    - 创建 `.env.test`
    - 创建 `.env.production`
    - _需求: 5.1_
  - [x] 6.3 创建类型安全的环境配置访问
    - 创建 `src/common/env.ts`
    - 定义 IEnvConfig 接口
    - 提供默认值处理
    - _需求: 5.2, 5.3_
  - [x] 6.4 更新 config.ts 使用新的环境配置
    - 修改 `src/common/config.ts`
    - 移除运行时环境切换逻辑
    - 使用 ENV 配置
    - _需求: 5.4_

- [x] 7. 集成到应用入口

  - [x] 7.1 更新 App 入口集成 ErrorBoundary 和 ThemeProvider
    - 修改 `src/app/index.tsx`
    - 在根级别添加 ErrorBoundary
    - 添加 ThemeProvider 包裹应用
    - _需求: 2.4, 4.3_

- [x] 8. 最终检查点 - 确保所有测试通过
  - 确保所有测试通过，如有问题请询问用户。
