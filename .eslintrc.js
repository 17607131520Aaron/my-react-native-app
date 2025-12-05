/**
 * ESLint 配置文件
 * 参考蚂蚁金服、阿里巴巴、字节跳动等大厂前端规范
 * 针对 React Native 项目优化
 */
module.exports = {
  root: true,
  env: {
    'react-native/react-native': true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    '@react-native', // React Native 官方推荐配置
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react-native/recommended', // 使用 recommended 而非 all，更灵活
    'prettier', // 必须放在最后，覆盖其他配置
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
    sourceType: 'module',
    // 移除 project 配置以提高性能，除非需要类型感知规则
    // project: './tsconfig.json',
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'react-native',
    'import', // 顶级团队常用：导入排序和检查
    'prettier',
  ],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true, // 总是尝试解析 TypeScript 文件
        project: './tsconfig.json',
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
  rules: {
    // Prettier 集成
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],

    // TypeScript 规则（严格模式）
    '@typescript-eslint/explicit-module-boundary-types': 'off', // 保持关闭，避免过度注解
    '@typescript-eslint/no-explicit-any': 'error', // 严格禁止 any 类型
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off', // 保持关闭，TypeScript 会推断
    '@typescript-eslint/no-empty-function': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'error', // 禁止非空断言，更安全
    '@typescript-eslint/prefer-nullish-coalescing': 'error', // 优先使用 ??
    '@typescript-eslint/prefer-optional-chain': 'error', // 优先使用可选链
    '@typescript-eslint/no-unnecessary-type-assertion': 'error', // 禁止不必要的类型断言
    '@typescript-eslint/no-floating-promises': 'error', // 禁止未处理的 Promise
    '@typescript-eslint/await-thenable': 'error', // 禁止 await 非 Promise
    '@typescript-eslint/no-misused-promises': 'error', // 禁止 Promise 误用
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': true,
        'ts-nocheck': true,
        'ts-check': false,
      },
    ],

    // React 规则（严格模式）
    'react/react-in-jsx-scope': 'off', // React 17+ 不需要导入 React
    'react/prop-types': 'off', // 使用 TypeScript 进行类型检查
    'react/display-name': 'off',
    'react/no-unescaped-entities': 'error', // 严格禁止未转义实体
    'react/jsx-uses-react': 'off',
    'react/jsx-uses-vars': 'error',
    'react/jsx-key': [
      'error',
      {
        checkFragmentShorthand: true,
        checkKeyMustBeforeSpread: true,
        warnOnDuplicates: true,
      },
    ], // 严格检查 key
    'react/jsx-no-useless-fragment': 'error', // 禁止无用的 Fragment
    'react/jsx-no-duplicate-props': 'error', // 禁止重复 props
    'react/jsx-no-undef': 'error', // 禁止未定义的 JSX
    'react/no-array-index-key': 'warn', // 警告使用索引作为 key
    'react/no-danger': 'warn', // 警告使用 dangerouslySetInnerHTML
    'react/no-deprecated': 'warn', // 警告使用废弃的 API
    'react/no-direct-mutation-state': 'error', // 禁止直接修改 state
    'react/no-unsafe': 'warn', // 警告不安全的生命周期

    // React Hooks 规则（严格模式）
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error', // 严格检查依赖项

    // React Native 规则（严格模式）
    'react-native/no-unused-styles': 'error', // 严格禁止未使用的样式
    'react-native/split-platform-components': 'warn', // 保持警告，平台分离是建议
    'react-native/no-inline-styles': 'error', // 严格禁止内联样式，强制使用 StyleSheet
    'react-native/no-color-literals': 'error', // 严格禁止颜色字面量，必须使用常量
    'react-native/no-raw-text': 'off', // 保持关闭，允许直接使用文本
    'react-native/no-single-element-style-arrays': 'error', // 严格检查样式数组

    // 通用规则（严格模式）
    'no-console': ['error', { allow: ['warn', 'error'] }], // 严格禁止 console，只允许 warn/error
    'no-debugger': 'error',
    'no-unused-vars': 'off', // 使用 TypeScript 版本
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-template': 'error',
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: ['state', 'acc', 'e', 'ctx', 'req', 'request', 'res', 'response', '$scope'],
      },
    ],
    'no-nested-ternary': 'error', // 严格禁止嵌套三元运算符
    'no-unneeded-ternary': 'error',
    'spaced-comment': ['error', 'always', { markers: ['/'] }],
    'eqeqeq': ['error', 'always', { null: 'ignore' }],
    'curly': ['error', 'all'],
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    'no-implicit-coercion': 'error', // 禁止隐式类型转换
    'no-await-in-loop': 'error', // 禁止在循环中使用 await
    'no-promise-executor-return': 'error', // 禁止 Promise executor 返回值
    'require-atomic-updates': 'error', // 要求原子更新
    'no-return-await': 'error', // 禁止不必要的 return await
    'prefer-promise-reject-errors': 'error', // Promise reject 必须使用 Error
    'no-throw-literal': 'error', // 禁止抛出字面量，必须抛出 Error

    // Import 相关规则（顶级团队标准）
    'sort-imports': [
      'warn',
      {
        ignoreCase: false,
        ignoreDeclarationSort: true, // 使用 eslint-plugin-import 进行排序
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        allowSeparatedGroups: true,
      },
    ],
    // eslint-plugin-import 规则（顶级团队必备）
    'import/order': [
      'error',
      {
        groups: [
          'builtin', // Node.js 内置模块
          'external', // 外部依赖
          'internal', // 内部模块
          'parent', // 父级目录
          'sibling', // 同级目录
          'index', // index 文件
        ],
        'newlines-between': 'always', // 组之间必须有空行
        alphabetize: {
          order: 'asc', // 按字母顺序排序
          caseInsensitive: true, // 忽略大小写
        },
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
          {
            pattern: 'react-native',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@react-native/**',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@react-navigation/**',
            group: 'external',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['react', 'react-native'],
      },
    ],
    'import/no-unresolved': 'off', // TypeScript 会处理
    'import/no-duplicates': 'error', // 禁止重复导入
    'import/no-unused-modules': 'off', // 性能问题，保持关闭
    'import/no-cycle': ['error', { maxDepth: 10 }], // 禁止循环依赖
    'import/no-self-import': 'error', // 禁止自己导入自己
    'import/no-useless-path-segments': [
      'error',
      {
        noUselessIndex: true, // 禁止无用的 index
      },
    ],
    'import/prefer-default-export': 'off', // React Native 常用 named export
    'import/no-default-export': 'off', // 允许 default export
    'import/no-named-as-default': 'warn', // 警告命名导出与默认导出同名
    'import/first': 'error', // import 必须在文件顶部
    'import/newline-after-import': 'error', // import 后必须有空行
    'import/no-absolute-path': 'error', // 禁止绝对路径（React Native 需要相对路径）
    'import/no-relative-packages': 'warn', // 警告相对路径导入 node_modules

    // 代码质量规则（严格模式）
    'no-else-return': 'error', // 严格禁止不必要的 else return
    'no-useless-return': 'error',
    'no-useless-concat': 'error',
    'prefer-destructuring': [
      'error', // 改为 error
      {
        array: false, // 数组解构可能影响可读性
        object: true,
      },
    ],
    'no-useless-rename': 'error', // 禁止无用的重命名
    'no-useless-computed-key': 'error', // 禁止无用的计算属性键
    'no-useless-constructor': 'error', // 禁止无用的构造函数
    'prefer-spread': 'error', // 优先使用扩展运算符
    'prefer-rest-params': 'error', // 优先使用 rest 参数
    'prefer-const': 'error', // 已存在，确保生效
    'no-restricted-syntax': [
      'error',
      {
        selector: 'CallExpression[callee.name="setTimeout"][arguments.length!=2]',
        message: 'setTimeout 必须包含延迟参数',
      },
    ],

    // 顶级团队常用规则（补充）
    'no-void': 'error', // 禁止 void 操作符
    'no-labels': 'error', // 禁止标签语句
    'no-eval': 'error', // 禁止 eval
    'no-implied-eval': 'error', // 禁止隐式 eval
    'no-new-func': 'error', // 禁止 new Function
    'no-script-url': 'error', // 禁止 javascript: URL
    'no-iterator': 'error', // 禁止使用 __iterator__
    'no-proto': 'error', // 禁止使用 __proto__
    'no-restricted-properties': [
      'error',
      {
        object: 'console',
        property: 'log',
        message: '使用 console.warn 或 console.error 替代 console.log',
      },
    ],
    'no-underscore-dangle': [
      'error',
      {
        allow: ['__DEV__', '__dirname', '__filename'], // React Native 允许的
        allowAfterThis: false,
        allowAfterSuper: false,
        enforceInMethodNames: true,
      },
    ],
    'no-magic-numbers': [
      'warn',
      {
        ignore: [-1, 0, 1, 2], // 允许常见的数字
        ignoreArrayIndexes: true,
        ignoreDefaultValues: true,
        ignoreNumericLiteralTypes: true,
        ignoreReadonlyClassProperties: true,
        ignoreEnums: true,
        detectObjects: false,
      },
    ],
    'complexity': ['warn', { max: 20 }], // 限制圈复杂度
    'max-depth': ['warn', { max: 5 }], // 限制嵌套深度
    'max-lines-per-function': [
      'warn',
      {
        max: 100,
        skipBlankLines: true,
        skipComments: true,
      },
    ],
    'max-params': ['warn', { max: 5 }], // 限制参数数量
  },
  overrides: [
    {
      files: ['*.test.ts', '*.test.tsx', '*.spec.ts', '*.spec.tsx'],
      env: {
        jest: true,
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
    {
      files: ['tsconfig.json'],
      rules: {
        // React Native 0.82.1 使用 bundler 模块解析，这是正确的配置
        '@typescript-eslint/ban-ts-comment': 'off',
      },
    },
  ],
  ignorePatterns: [
    'node_modules/',
    'android/',
    'ios/',
    '.gradle/',
    'build/',
    'dist/',
    '*.config.js',
    'coverage/',
  ],
};
