/**
 * Prettier 配置文件
 * 参考蚂蚁金服、阿里巴巴、字节跳动等大厂前端规范
 */
module.exports = {
  // 使用单引号
  singleQuote: true,

  // 在语句末尾添加分号
  semi: true,

  // 使用 2 个空格缩进
  tabWidth: 2,
  useTabs: false,

  // 行宽限制为 100 字符（大厂常用 80-120，React Native 推荐 100）
  printWidth: 100,

  // 在对象和数组最后一个元素后添加尾随逗号
  trailingComma: 'all',

  // 箭头函数参数只有一个时，避免括号
  arrowParens: 'avoid',

  // 对象大括号内的空格
  bracketSpacing: true,

  // JSX 标签的反尖括号需要换行
  bracketSameLine: false,

  // 换行符使用 lf（Linux/Mac），但在 Windows 上自动转换
  endOfLine: 'auto',

  // 在 JSX 中使用单引号
  jsxSingleQuote: true,

  // 多行时尽可能打印尾随逗号
  // 'none' - 无尾随逗号
  // 'es5' - 在 ES5 中有效的尾随逗号（对象、数组等）
  // 'all' - 尽可能使用尾随逗号（包括函数参数）

  // 仅格式化文件顶部包含 @prettier 或 @format 标记的文件
  requirePragma: false,

  // 在文件顶部插入 @format 标记
  insertPragma: false,

  // HTML 空白敏感性
  htmlWhitespaceSensitivity: 'css',

  // Vue 文件中的 script 和 style 标签缩进（React Native 项目不需要，但保留以兼容）
  vueIndentScriptAndStyle: false,

  // React Native 特定配置
  // 对于 React Native，建议保持默认配置，确保与 Metro bundler 兼容

  // 换行符设置
  // 'lf' - 仅换行（\n），常见于 Linux 和 macOS
  // 'crlf' - 回车符 + 换行符（\r\n），常见于 Windows
  // 'cr' - 仅回车符（\r），很少使用
  // 'auto' - 保持现有的行尾（通过查看第一行后的内容来使用一个文件中的第一个换行符）
  // 使用 'auto' 以确保跨平台兼容性
};
