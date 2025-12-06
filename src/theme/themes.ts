/**
 * 主题配置
 */

import { darkColors, lightColors } from './colors';
import { shadows } from './shadows';
import { spacing } from './spacing';
import { typography } from './typography';

import type { ITheme } from './types';

/** 亮色主题 */
export const lightTheme: ITheme = {
  colors: lightColors,
  spacing,
  typography,
  shadows,
  isDark: false,
};

/** 暗色主题 */
export const darkTheme: ITheme = {
  colors: darkColors,
  spacing,
  typography,
  shadows,
  isDark: true,
};
