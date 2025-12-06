/**
 * 环境配置
 * 提供类型安全的环境变量访问
 */

import Config from 'react-native-config';

/** 环境类型 */
export type TEnvType = 'development' | 'test' | 'pre' | 'production';

/** 环境配置接口 */
export interface IEnvConfig {
  /** API 基础地址 */
  API_BASE_URL: string;
  /** API 超时时间 (毫秒) */
  API_TIMEOUT: number;
  /** 当前环境 */
  ENV: TEnvType;
  /** 是否调试模式 */
  DEBUG: boolean;
  /** 存储前缀 */
  STORAGE_PREFIX: string;
}

/**
 * 类型安全的环境配置
 * 提供默认值处理
 */
export const ENV: IEnvConfig = {
  API_BASE_URL: Config.API_BASE_URL ?? 'http://localhost:5000',
  API_TIMEOUT: Number(Config.API_TIMEOUT) || 10000,
  ENV: (Config.ENV as TEnvType) ?? 'development',
  DEBUG: Config.DEBUG === 'true',
  STORAGE_PREFIX: Config.STORAGE_PREFIX ?? '@MallBrain:',
};

/**
 * 检查是否为开发环境
 */
export const isDevelopment = (): boolean => ENV.ENV === 'development';

/**
 * 检查是否为生产环境
 */
export const isProduction = (): boolean => ENV.ENV === 'production';

/**
 * 检查是否为测试环境
 */
export const isTest = (): boolean => ENV.ENV === 'test';
