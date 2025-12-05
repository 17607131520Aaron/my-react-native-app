# ESLint & Prettier 配置说明

本文档说明项目的 ESLint 和 Prettier 配置，这些配置参考了蚂蚁金服、阿里巴巴、字节跳动等大厂的前端最佳实践。

## 配置特点

### ✅ 符合大厂最佳实践

1. **TypeScript 支持**
   - 使用 `@typescript-eslint` 进行类型检查
   - 关闭冗余的 prop-types 检查（使用 TypeScript）
   - 合理的 any 类型警告策略

2. **React & React Native 优化**
   - 支持 React 17+ 新特性（无需导入 React）
   - React Hooks 规则检查
   - React Native 特定规则（样式、平台分离等）

3. **代码质量规则**
   - 强制使用 const/let，禁止 var
   - 优先使用箭头函数和模板字符串
   - 禁止嵌套三元运算符（警告）
   - 强制使用全等比较（===）

4. **性能优化**
   - 移除了 `parserOptions.project` 配置以提高性能
   - 使用 `plugin:react-native/recommended` 而非 `all`，更灵活

### ✅ 适合 React Native 项目

1. **React Native 特定规则**
   - `react-native/no-unused-styles`: 检测未使用的样式
   - `react-native/split-platform-components`: 建议平台分离
   - `react-native/no-inline-styles`: 建议使用 StyleSheet
   - `react-native/no-color-literals`: 建议使用常量定义颜色

2. **跨平台兼容性**
   - Prettier 使用 `endOfLine: 'auto'` 确保跨平台兼容
   - 忽略原生代码目录（android/, ios/）

3. **Metro Bundler 兼容**
   - 配置与 Metro bundler 完全兼容
   - 支持 Fast Refresh

## Prettier 配置说明

### 核心配置
- **单引号**: `singleQuote: true` - 统一使用单引号
- **分号**: `semi: true` - 语句末尾添加分号
- **缩进**: `tabWidth: 2` - 使用 2 个空格
- **行宽**: `printWidth: 100` - 每行最多 100 字符
- **尾随逗号**: `trailingComma: 'all'` - 多行时添加尾随逗号
- **箭头函数**: `arrowParens: 'avoid'` - 单参数时省略括号

### React Native 优化
- `jsxSingleQuote: true` - JSX 中使用单引号
- `bracketSameLine: false` - JSX 标签的 `>` 换行
- `endOfLine: 'auto'` - 自动处理换行符，确保跨平台兼容

## 使用建议

### 开发时
```bash
# 检查代码规范
pnpm lint

# 自动修复可修复的问题
pnpm lint --fix

# 格式化代码
pnpm prettier --write "src/**/*.{ts,tsx}"
```

### VS Code 配置
在 `.vscode/settings.json` 中添加：
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## 规则调整建议

### 如果项目需要更严格的规则
1. 启用 `react-native/no-raw-text` 规则
2. 将 `react-native/no-inline-styles` 改为 `error`
3. 启用 `@typescript-eslint/explicit-function-return-type`

### 如果项目需要更宽松的规则
1. 将部分 `warn` 规则改为 `off`
2. 调整 `no-nested-ternary` 为 `off`
3. 放宽 `no-console` 限制

## 常见问题

### Q: 为什么移除了 `parserOptions.project`？
A: 该配置需要类型检查，会显著降低 ESLint 性能。除非需要类型感知规则，否则不建议启用。

### Q: 为什么使用 `plugin:react-native/recommended` 而不是 `all`？
A: `all` 规则过于严格，可能影响开发效率。`recommended` 提供了必要的规则，同时保持灵活性。

### Q: Prettier 和 ESLint 会冲突吗？
A: 不会。我们使用 `eslint-config-prettier` 来禁用 ESLint 中与 Prettier 冲突的规则，确保两者协同工作。

## 参考资源

- [React Native ESLint Config](https://github.com/facebook/react-native/tree/main/packages/eslint-config-react-native)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [Prettier Documentation](https://prettier.io/docs/en/)
- [Ant Design ESLint Config](https://github.com/ant-design/eslint-config-ant-design)

