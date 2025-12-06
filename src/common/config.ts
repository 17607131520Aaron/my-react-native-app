/**
 * 应用配置
 * 使用环境变量提供配置
 */

import { ENV } from './env';

// API配置接口
interface IApiConfig {
  baseURL: string;
  timeout: number;
}

/**
 * 获取 API 配置
 * 直接从环境变量读取，无需运行时切换
 */
export const getApiConfig = (): IApiConfig => ({
  baseURL: ENV.API_BASE_URL,
  timeout: ENV.API_TIMEOUT,
});

/**
 * 获取当前环境
 */
export const getEnvironment = (): string => ENV.ENV;

// 其他全局配置
export const APP_CONFIG = {
  // 应用存储前缀
  storagePrefix: ENV.STORAGE_PREFIX,
  // 用户令牌的存储键名
  tokenKey: `${ENV.STORAGE_PREFIX}token`,
  // 用户信息的存储键名
  userKey: `${ENV.STORAGE_PREFIX}user`,
  // 网络请求最大重试次数
  maxRetryCount: 3,
};
