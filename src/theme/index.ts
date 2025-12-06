/**
 * 主题系统统一导出
 */

// 类型
export type {
  IColors,
  ISpacing,
  ITextStyle,
  ITypography,
  IShadowStyle,
  IShadows,
  ITheme,
} from './types';

// 配置
export { lightColors, darkColors } from './colors';
export { spacing } from './spacing';
export { typography } from './typography';
export { shadows } from './shadows';
export { lightTheme, darkTheme } from './themes';

// Context 和 Hook
export {
  ThemeContext,
  ThemeProvider,
  type IThemeContext,
  type IThemeProviderProps,
} from './ThemeContext';
export { useTheme } from './useTheme';
