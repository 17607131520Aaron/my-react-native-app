# 格式化问题排查指南

## 🔍 问题诊断

如果格式化功能没有生效，请按以下步骤排查：

## ✅ 检查清单

### 1. 确认 Prettier 扩展已安装

**检查方法**：
1. 按 `Cmd+Shift+X` (Mac) 或 `Ctrl+Shift+X` (Windows/Linux) 打开扩展面板
2. 搜索 `Prettier - Code formatter`
3. 确认扩展 ID 为 `esbenp.prettier-vscode` 且已安装并启用

**如果未安装**：
- 点击 "Install" 安装扩展
- 安装后重新加载 VS Code

### 2. 确认 Prettier 配置文件存在

**检查文件**：
- ✅ `.prettierrc.js` - 应该存在于项目根目录
- ✅ `.prettierignore` - 应该存在于项目根目录

**验证配置**：
```bash
# 在项目根目录运行
pnpm prettier --check "src/**/*.{ts,tsx}"
```

### 3. 检查 VS Code 设置

**确认以下设置**：
- ✅ `editor.formatOnSave`: `true`
- ✅ `editor.defaultFormatter`: `"esbenp.prettier-vscode"`
- ✅ `prettier.enable`: `true`

**检查方法**：
1. 打开 `.vscode/settings.json`
2. 确认上述设置已配置

### 4. 检查文件类型关联

**确认文件类型已配置格式化器**：
- `[typescript]`: `"editor.defaultFormatter": "esbenp.prettier-vscode"`
- `[typescriptreact]`: `"editor.defaultFormatter": "esbenp.prettier-vscode"`
- `[javascript]`: `"editor.defaultFormatter": "esbenp.prettier-vscode"`
- `[javascriptreact]`: `"editor.defaultFormatter": "esbenp.prettier-vscode"`

### 5. 手动测试格式化

**测试方法**：
1. 打开任意 `.ts` 或 `.tsx` 文件
2. 按 `Shift+Option+F` (Mac) 或 `Shift+Alt+F` (Windows/Linux)
3. 或者右键选择 "Format Document"
4. 查看是否格式化成功

**如果手动格式化也不工作**：
- 检查 Prettier 扩展的输出日志
- 按 `Cmd+Shift+P`，输入 `Output: Show Output Channels`
- 选择 "Prettier" 查看错误信息

## 🛠️ 常见问题解决

### 问题 1: "Prettier: No configuration file found"

**原因**：Prettier 找不到配置文件

**解决方案**：
1. 确认 `.prettierrc.js` 在项目根目录
2. 在 `.vscode/settings.json` 中添加：
   ```json
   "prettier.configPath": ".prettierrc.js"
   ```

### 问题 2: "Prettier: Failed to load"

**原因**：Prettier 扩展无法加载

**解决方案**：
1. 重新安装 Prettier 扩展
2. 重新加载 VS Code (`Cmd+R` 或 `Ctrl+R`)
3. 检查 Prettier 扩展的输出日志

### 问题 3: 保存时不自动格式化

**原因**：`editor.formatOnSave` 未启用或被覆盖

**解决方案**：
1. 检查 `.vscode/settings.json` 中的 `editor.formatOnSave`
2. 检查用户设置是否覆盖了工作区设置
3. 按 `Cmd+,` (Mac) 或 `Ctrl+,` (Windows/Linux) 打开设置
4. 搜索 "format on save"，确认已启用

### 问题 4: 某些文件类型不格式化

**原因**：该文件类型未配置格式化器

**解决方案**：
在 `.vscode/settings.json` 中添加：
```json
"[文件类型]": {
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

### 问题 5: 格式化结果不符合预期

**原因**：Prettier 配置未正确加载

**解决方案**：
1. 检查 `.prettierrc.js` 语法是否正确
2. 运行 `pnpm prettier --check` 验证配置
3. 查看 Prettier 扩展的输出日志

## 🔧 快速修复步骤

### 步骤 1: 重新加载 VS Code
```
Cmd+Shift+P (Mac) 或 Ctrl+Shift+P (Windows/Linux)
输入: Developer: Reload Window
```

### 步骤 2: 检查扩展状态
```
Cmd+Shift+P
输入: Extensions: Show Installed Extensions
确认 Prettier 扩展已启用
```

### 步骤 3: 验证配置
```bash
# 在终端运行
pnpm prettier --check "src/**/*.{ts,tsx}"
```

### 步骤 4: 手动格式化测试
```
打开任意 .ts 文件
按 Shift+Option+F (Mac) 或 Shift+Alt+F (Windows/Linux)
```

## 📝 调试信息

如果问题仍然存在，请收集以下信息：

1. **Prettier 扩展版本**：在扩展面板查看
2. **VS Code 版本**：`Help > About`
3. **Prettier 输出日志**：`View > Output > Prettier`
4. **配置文件内容**：`.prettierrc.js`
5. **错误信息**：如果有任何错误提示

## ✅ 验证格式化已生效

格式化成功后，你应该看到：

1. ✅ 保存文件时自动格式化
2. ✅ 单引号替换双引号
3. ✅ 自动添加分号
4. ✅ 代码缩进为 2 个空格
5. ✅ 行宽限制为 100 字符
6. ✅ 尾随逗号自动添加

## 🎯 测试文件

创建一个测试文件验证格式化：

```typescript
// test-format.ts
const test = {
  name: "test",
  value: 123
}

function testFunction( param1: string, param2: number ) {
  return param1 + param2
}
```

保存后应该自动格式化为：

```typescript
// test-format.ts
const test = {
  name: 'test',
  value: 123,
};

function testFunction(param1: string, param2: number) {
  return param1 + param2;
}
```

