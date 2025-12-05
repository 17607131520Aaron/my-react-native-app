# 严格模式配置说明

本文档说明项目的 ESLint 严格模式配置，针对 **React Native + TypeScript** 项目进行了优化。

## 配置严格程度评估

### ✅ 当前配置：**严格模式**

已针对 React Native + TypeScript 项目启用了严格规则，确保代码质量和类型安全。

## 主要严格规则

### 1. TypeScript 严格规则

| 规则 | 级别 | 说明 |
|------|------|------|
| `@typescript-eslint/no-explicit-any` | `error` | **严格禁止 any 类型**，强制使用具体类型 |
| `@typescript-eslint/no-non-null-assertion` | `error` | 禁止非空断言 `!`，更安全的空值处理 |
| `@typescript-eslint/prefer-nullish-coalescing` | `error` | 强制使用 `??` 而非 `\|\|` |
| `@typescript-eslint/prefer-optional-chain` | `error` | 强制使用可选链 `?.` |
| `@typescript-eslint/no-floating-promises` | `error` | 禁止未处理的 Promise |
| `@typescript-eslint/await-thenable` | `error` | 禁止 await 非 Promise 值 |
| `@typescript-eslint/no-misused-promises` | `error` | 禁止 Promise 误用 |

**为什么严格？**
- 确保类型安全，避免运行时错误
- 强制使用现代 TypeScript 特性
- 防止常见的异步编程错误

### 2. React 严格规则

| 规则 | 级别 | 说明 |
|------|------|------|
| `react/jsx-key` | `error` | **严格检查 key**，包括 Fragment |
| `react/jsx-no-useless-fragment` | `error` | 禁止无用的 `<></>` |
| `react/jsx-no-duplicate-props` | `error` | 禁止重复 props |
| `react/no-direct-mutation-state` | `error` | 禁止直接修改 state |
| `react/no-unescaped-entities` | `error` | 禁止未转义的 HTML 实体 |

**为什么严格？**
- 防止 React 渲染错误
- 确保组件状态管理正确
- 提高代码可维护性

### 3. React Hooks 严格规则

| 规则 | 级别 | 说明 |
|------|------|------|
| `react-hooks/exhaustive-deps` | `error` | **严格检查依赖项**，防止闭包陷阱 |

**为什么严格？**
- 防止常见的 Hooks 依赖问题
- 避免内存泄漏和性能问题
- 确保 Hooks 正确使用

### 4. React Native 严格规则

| 规则 | 级别 | 说明 |
|------|------|------|
| `react-native/no-inline-styles` | `error` | **强制使用 StyleSheet**，禁止内联样式 |
| `react-native/no-color-literals` | `error` | **强制使用颜色常量**，禁止硬编码颜色 |
| `react-native/no-unused-styles` | `error` | 禁止未使用的样式定义 |

**为什么严格？**
- 提高性能（StyleSheet 优化）
- 统一主题管理
- 便于维护和重构

### 5. 通用代码质量规则

| 规则 | 级别 | 说明 |
|------|------|------|
| `no-console` | `error` | 严格禁止 console，只允许 warn/error |
| `no-nested-ternary` | `error` | 禁止嵌套三元运算符 |
| `no-else-return` | `error` | 禁止不必要的 else return |
| `no-implicit-coercion` | `error` | 禁止隐式类型转换 |
| `no-await-in-loop` | `error` | 禁止在循环中使用 await |
| `no-throw-literal` | `error` | 必须抛出 Error 对象 |

**为什么严格？**
- 提高代码可读性
- 防止性能问题
- 确保错误处理正确

## 与之前配置的对比

### 从 `warn` 升级到 `error` 的规则

1. ✅ `@typescript-eslint/no-explicit-any`: `warn` → `error`
2. ✅ `react-hooks/exhaustive-deps`: `warn` → `error`
3. ✅ `react-native/no-inline-styles`: `warn` → `error`
4. ✅ `react-native/no-color-literals`: `warn` → `error`
5. ✅ `react-native/no-unused-styles`: `warn` → `error`
6. ✅ `no-nested-ternary`: `warn` → `error`
7. ✅ `no-else-return`: `warn` → `error`
8. ✅ `no-console`: `warn` → `error`
9. ✅ `prefer-destructuring`: `warn` → `error`

### 新增的严格规则

1. ✅ TypeScript Promise 相关规则（5 条）
2. ✅ React JSX 相关规则（4 条）
3. ✅ 异步编程规则（3 条）
4. ✅ 代码质量规则（5 条）

## 使用建议

### 开发时

```bash
# 检查所有规则
pnpm lint

# 自动修复可修复的问题
pnpm lint --fix

# 只检查特定文件
pnpm lint src/app/App.tsx
```

### 如果某些规则过于严格

可以在特定文件中禁用规则：

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = fetchData();

// 或者整个文件
/* eslint-disable react-native/no-inline-styles */
```

### 团队协作

1. **代码审查时**：确保所有 error 级别的问题都已修复
2. **CI/CD 集成**：在构建流程中加入 lint 检查
3. **Pre-commit Hook**：提交前自动运行 lint

## 常见问题

### Q: 为什么禁止内联样式？
A: StyleSheet 会被优化，性能更好，且便于统一管理样式。

### Q: 为什么禁止 any 类型？
A: any 会失去 TypeScript 的类型安全优势，应该使用具体类型或 `unknown`。

### Q: 为什么禁止嵌套三元运算符？
A: 嵌套三元运算符可读性差，应该使用 if-else 或函数提取。

### Q: 这些规则会影响开发效率吗？
A: 初期可能需要适应，但长期来看会：
- 减少 bug
- 提高代码质量
- 降低维护成本
- 提升团队协作效率

## 配置调整

如果某些规则确实不适合你的项目，可以：

1. **降低规则级别**：将 `error` 改为 `warn`
2. **禁用特定规则**：在 `.eslintrc.js` 中设置为 `off`
3. **文件级禁用**：使用 `eslint-disable` 注释

## 总结

当前配置已达到**企业级严格标准**，适合：
- ✅ 生产环境项目
- ✅ 团队协作项目
- ✅ 长期维护项目
- ✅ 对代码质量要求高的项目

如果项目还在快速迭代阶段，可以考虑将部分规则降级为 `warn`，但建议保持核心规则为 `error`。

