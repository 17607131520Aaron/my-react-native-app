/**
 * 主题系统类型定义
 */

/** 颜色配置 */
export interface IColors {
  /** 主色 */
  primary: string;
  /** 次要色 */
  secondary: string;
  /** 背景色 */
  background: string;
  /** 表面色 */
  surface: string;
  /** 文本色 */
  text: string;
  /** 次要文本色 */
  textSecondary: string;
  /** 边框色 */
  border: string;
  /** 错误色 */
  error: string;
  /** 成功色 */
  success: string;
  /** 警告色 */
  warning: string;
}

/** 间距配置 */
export interface ISpacing {
  /** 4px */
  xs: number;
  /** 8px */
  sm: number;
  /** 16px */
  md: number;
  /** 24px */
  lg: number;
  /** 32px */
  xl: number;
  /** 48px */
  xxl: number;
}

/** 字体样式 */
export interface ITextStyle {
  fontSize: number;
  fontWeight: string;
  lineHeight: number;
}

/** 字体配置 */
export interface ITypography {
  h1: ITextStyle;
  h2: ITextStyle;
  h3: ITextStyle;
  body: ITextStyle;
  caption: ITextStyle;
}

/** 阴影样式 */
export interface IShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

/** 阴影配置 */
export interface IShadows {
  sm: IShadowStyle;
  md: IShadowStyle;
  lg: IShadowStyle;
}

/** 完整主题 */
export interface ITheme {
  colors: IColors;
  spacing: ISpacing;
  typography: ITypography;
  shadows: IShadows;
  isDark: boolean;
}
