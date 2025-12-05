# VS Code 扩展安装指南

## ⚠️ 警告说明

### 1. `launch.json` 中的警告

**警告信息**：`无法识别此调试类型 "reactnative"`

**原因**：需要安装 React Native 调试扩展才能识别 `reactnative` 调试类型。

**解决方案**：安装以下扩展：

```bash
# 方式1：通过 VS Code 扩展市场安装
# 搜索并安装：React Native Tools
# 扩展 ID: msjsdiag.vscode-react-native
```

**或者**：在 VS Code 中：
1. 按 `Cmd+Shift+X` (Mac) 或 `Ctrl+Shift+X` (Windows/Linux) 打开扩展面板
2. 搜索 `React Native Tools`
3. 点击安装

### 2. `extensions.json` 中的重复项

**已修复**：移除了重复的 `ms-vscode.vscode-typescript-next` 扩展 ID。

## 📦 必需扩展列表

### 核心工具（必须安装）

1. **Prettier - Code formatter**
   - ID: `esbenp.prettier-vscode`
   - 用途：代码格式化

2. **ESLint**
   - ID: `dbaeumer.vscode-eslint`
   - 用途：代码质量检查

3. **TypeScript and JavaScript Language Features**
   - ID: `ms-vscode.vscode-typescript-next`
   - 用途：TypeScript 支持

4. **React Native Tools** ⚠️ **必需（用于调试）**
   - ID: `msjsdiag.vscode-react-native`
   - 用途：React Native 调试支持

### 推荐扩展（建议安装）

5. **ES7+ React/Redux/React-Native snippets**
   - ID: `dsznajder.es7-react-js-snippets`
   - 用途：React 代码片段

6. **Error Lens**
   - ID: `usernamehw.errorlens`
   - 用途：行内错误提示

7. **Path Intellisense**
   - ID: `christian-kohler.path-intellisense`
   - 用途：路径智能提示

8. **GitLens**
   - ID: `eamodio.gitlens`
   - 用途：Git 增强

## 🚀 快速安装

### 方法1：通过 VS Code 推荐扩展安装

1. 打开 VS Code
2. 按 `Cmd+Shift+P` (Mac) 或 `Ctrl+Shift+P` (Windows/Linux)
3. 输入 `Extensions: Show Recommended Extensions`
4. 点击 "Install All" 安装所有推荐扩展

### 方法2：手动安装

在扩展面板中搜索并安装上述扩展 ID。

### 方法3：命令行安装（如果安装了 `code` 命令）

```bash
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension msjsdiag.vscode-react-native
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension usernamehw.errorlens
code --install-extension christian-kohler.path-intellisense
code --install-extension eamodio.gitlens
```

## ✅ 安装后验证

安装完 **React Native Tools** 扩展后：

1. 重新加载 VS Code（`Cmd+R` 或 `Ctrl+R`）
2. 打开 `.vscode/launch.json`
3. 警告应该消失
4. 在调试面板中可以看到 "Debug Android" 和 "Debug iOS" 选项

## 📝 注意事项

- **React Native Tools** 是调试 React Native 应用所必需的
- 如果没有安装，`launch.json` 中的 `reactnative` 类型将无法识别
- 其他扩展是可选的，但强烈推荐安装以获得最佳开发体验

