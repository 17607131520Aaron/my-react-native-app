# 格式化问题修复指南

## 🔍 问题诊断

保存时格式化不生效的常见原因：

### 1. Prettier 扩展未安装或未启用
- ✅ 检查：扩展面板中搜索 `Prettier - Code formatter`
- ✅ 确认：扩展 ID 为 `esbenp.prettier-vscode` 且已启用

### 2. ESLint 配置错误
- ✅ 已修复：移除了 `plugin:react-native/recommended`（与 `@react-native` 冲突）
- ✅ 已修复：修复了 `no-magic-numbers` 规则配置

### 3. VS Code 设置问题
- ✅ 已优化：`prettier.requireConfig: false` - 即使没有配置文件也启用
- ✅ 已优化：添加了 `prettier.documentSelectors` 明确文件类型

## ✅ 已修复的配置

### ESLint 配置
- 移除了重复的 `plugin:react-native/recommended`
- 修复了 `no-magic-numbers` 规则配置

### VS Code 设置
- `prettier.requireConfig: false` - 确保 Prettier 始终启用
- `prettier.documentSelectors` - 明确支持的文件类型
- `editor.formatOnSave: true` - 保存时自动格式化
- `source.fixAll.eslint: "explicit"` - 保存时自动修复 ESLint

## 🧪 测试步骤

### 1. 重新加载 VS Code
```
Cmd+Shift+P (Mac) 或 Ctrl+Shift+P (Windows/Linux)
输入: Developer: Reload Window
```

### 2. 验证 Prettier 扩展
- 打开扩展面板（`Cmd+Shift+X`）
- 搜索 `Prettier`
- 确认已安装并启用

### 3. 测试格式化
1. 打开 `src/app/App.tsx`
2. 添加一些格式问题（多余空行、错误缩进等）
3. 保存文件（`Cmd+S` 或 `Ctrl+S`）
4. 应该自动格式化

### 4. 手动测试
- 按 `Shift+Option+F` (Mac) 或 `Shift+Alt+F` (Windows/Linux)
- 应该立即格式化

## 🔧 如果仍然不工作

### 检查 Prettier 输出日志
1. 按 `Cmd+Shift+P`
2. 输入 `Output: Show Output Channels`
3. 选择 "Prettier"
4. 查看错误信息

### 检查 ESLint 输出日志
1. 按 `Cmd+Shift+P`
2. 输入 `Output: Show Output Channels`
3. 选择 "ESLint"
4. 查看错误信息

### 验证配置文件
```bash
# 测试 Prettier
pnpm prettier --check "src/**/*.{ts,tsx}"

# 测试 ESLint
pnpm eslint "src/**/*.{ts,tsx}"
```

## 📝 预期行为

保存文件时应该：
1. ✅ Prettier 格式化代码（缩进、引号、分号等）
2. ✅ ESLint 自动修复（删除多余空行、删除行尾空格等）
3. ✅ 导入自动排序
4. ✅ 删除多余空行（最多保留 1 个）

## ⚠️ 注意事项

- Prettier 不会删除多余空行（这是设计决定）
- ESLint 的 `no-multiple-empty-lines` 规则会处理多余空行
- 需要同时安装 Prettier 和 ESLint 扩展才能完整工作

