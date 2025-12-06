/**
 * 主题上下文
 */

import React, { createContext, type ReactNode, useMemo } from 'react';
import { useColorScheme } from 'react-native';

import { type TTheme as TThemeMode, useAppStore } from '../store/common/appStore';

import { darkTheme, lightTheme } from './themes';

import type { ITheme } from './types';

/** 主题上下文接口 */
export interface IThemeContext {
  /** 当前主题 */
  theme: ITheme;
  /** 主题模式 */
  themeMode: TThemeMode;
  /** 设置主题模式 */
  setThemeMode: (mode: TThemeMode) => void;
}

/** 主题上下文 */
export const ThemeContext = createContext<IThemeContext | null>(null);

/** ThemeProvider 属性 */
export interface IThemeProviderProps {
  children: ReactNode;
}

/** 主题提供者组件 */
export const ThemeProvider: React.FC<IThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const themeMode = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);

  const theme = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return themeMode === 'dark' ? darkTheme : lightTheme;
  }, [themeMode, systemColorScheme]);

  const contextValue = useMemo<IThemeContext>(
    () => ({
      theme,
      themeMode,
      setThemeMode: setTheme,
    }),
    [theme, themeMode, setTheme],
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};
