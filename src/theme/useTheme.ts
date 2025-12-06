/**
 * useTheme Hook
 */

import { useContext } from 'react';

import { type IThemeContext, ThemeContext } from './ThemeContext';

/**
 * 获取当前主题的 Hook
 * @returns 主题上下文
 * @throws 如果在 ThemeProvider 外部使用则抛出错误
 */
export const useTheme = (): IThemeContext => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme 必须在 ThemeProvider 内使用');
  }
  return context;
};
