/**
 * 应用级配置 Store
 * 存储主题、语言等通用配置
 */

import { createCommonStore } from '../core/createStore';

import type { IHydrationState } from '../core/types';

/** 主题类型 */
export type TTheme = 'light' | 'dark' | 'system';

/** 应用状态接口 */
export interface IAppState extends Record<string, unknown> {
  /** 当前主题 */
  theme: TTheme;
  /** 当前语言 */
  language: string;
  /** 设置主题 */
  setTheme: (theme: TTheme) => void;
  /** 设置语言 */
  setLanguage: (language: string) => void;
}

/** 应用 Store */
export const useAppStore = createCommonStore<IAppState>(
  'app',
  (set) => ({
    theme: 'system',
    language: 'zh-CN',
    setTheme: (theme) => set({ theme }),
    setLanguage: (language) => set({ language }),
  }),
  {
    whitelist: ['theme', 'language'],
  },
);

export type TAppStoreState = IAppState & IHydrationState;
