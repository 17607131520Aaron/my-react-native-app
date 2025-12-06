/**
 * 用户服务
 * 封装用户相关的 API 调用
 */

import { get, post, put } from '~/utils/request';

import type { IUserProfile } from '~/store/business/user/userStore';

/** 登录参数 */
export interface ILoginParams {
  username: string;
  password: string;
}

/** 登录响应 */
export interface ILoginResponse {
  token: string;
  user: IUserProfile;
}

/** 更新用户资料参数 */
export interface IUpdateProfileParams {
  name?: string;
  avatar?: string;
  email?: string;
  phone?: string;
}

/** 用户服务 */
export const userService = {
  /** 登录 */
  login: (params: ILoginParams) =>
    post<ILoginParams, ILoginResponse>({ url: '/auth/login', data: params }),

  /** 获取用户资料 */
  getProfile: () => get<void, IUserProfile>({ url: '/user/profile' }),

  /** 登出 */
  logout: () => post<void, void>({ url: '/auth/logout' }),

  /** 更新用户资料 */
  updateProfile: (params: IUpdateProfileParams) =>
    put<IUpdateProfileParams, IUserProfile>({ url: '/user/profile', data: params }),
};
