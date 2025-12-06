/**
 * 用户 Store
 * 存储用户认证状态和个人信息
 */

import { createBusinessStore } from '../../core/createStore';

import type { IHydrationState } from '../../core/types';

/** 用户资料接口 */
export interface IUserProfile {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  phone?: string;
}

/** 用户状态接口 */
export interface IUserState extends Record<string, unknown> {
  /** 用户令牌 */
  token: string | null;
  /** 用户资料 */
  profile: IUserProfile | null;
  /** 是否已认证 */
  isAuthenticated: boolean;
  /** 设置令牌 */
  setToken: (token: string | null) => void;
  /** 设置用户资料 */
  setProfile: (profile: IUserProfile | null) => void;
  /** 登出 */
  logout: () => void;
}

/** 用户 Store */
export const useUserStore = createBusinessStore<IUserState>(
  'user',
  'user',
  (set) => ({
    token: null,
    profile: null,
    isAuthenticated: false,
    setToken: (token) =>
      set({
        token,
        isAuthenticated: token !== null,
      }),
    setProfile: (profile) => set({ profile }),
    logout: () =>
      set({
        token: null,
        profile: null,
        isAuthenticated: false,
      }),
  }),
  {
    whitelist: ['token', 'profile', 'isAuthenticated'],
  },
);

export type TUserStoreState = IUserState & IHydrationState;
