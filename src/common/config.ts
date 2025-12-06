import AsyncStorage from '@react-native-async-storage/async-storage';

// API配置
interface IApiConfig {
  baseURL: string;
  timeout: number;
}

// 环境配置
interface IEnvironmentConfig {
  dev: IApiConfig;
  test: IApiConfig;
  pre: IApiConfig;
  prod: IApiConfig;
}

// 环境类型
export type TEnvironment = 'development' | 'test' | 'pre' | 'production';

// 环境存储键名
const ENV_STORAGE_KEY = '@MallBrain:environment';

// 当前环境（同步获取，初始值）
// 默认值：开发模式下为 development，生产模式下为 production
let currentEnv: TEnvironment = (__DEV__ ? 'development' : 'production') as TEnvironment;

// API配置
export const API_CONFIG: IEnvironmentConfig = {
  dev: {
    baseURL: 'http://localhost:5000',
    timeout: 5000,
  },
  test: {
    baseURL: 'https://test-api.mallbrain.com',
    timeout: 8000,
  },
  pre: {
    baseURL: 'https://pre-api.mallbrain.com',
    timeout: 10000,
  },
  prod: {
    baseURL: 'https://api.mallbrain.com',
    timeout: 10000,
  },
};

/**
 * 初始化环境配置（从存储中读取）
 * 应该在应用启动时调用
 */
export const initEnvironment = async (): Promise<void> => {
  try {
    const savedEnv = await AsyncStorage.getItem(ENV_STORAGE_KEY);
    if (savedEnv && ['development', 'test', 'pre', 'production'].includes(savedEnv)) {
      currentEnv = savedEnv as TEnvironment;
    }
  } catch (error) {
    console.error('Error reading environment from storage:', error);
  }
};

/**
 * 设置当前环境
 * @param env 环境类型
 */
export const setEnvironment = async (env: TEnvironment): Promise<void> => {
  try {
    currentEnv = env;
    await AsyncStorage.setItem(ENV_STORAGE_KEY, env);
  } catch (error) {
    console.error('Error saving environment to storage:', error);
    throw error;
  }
};

/**
 * 获取当前环境
 */
export const getEnvironment = (): TEnvironment => {
  return currentEnv;
};

// 获取当前环境的API配置
export const getApiConfig = (): IApiConfig => {
  switch (currentEnv) {
    case 'production':
      return API_CONFIG.prod;
    case 'pre':
      return API_CONFIG.pre;
    case 'test':
      return API_CONFIG.test;
    case 'development':
    default:
      return API_CONFIG.dev;
  }
};

// 其他全局配置
export const APP_CONFIG = {
  // 应用存储前缀，用于区分应用在本地存储中的数据，避免与其他应用冲突
  storagePrefix: '@MallBrain:',
  // 用户令牌的存储键名，用于在本地存储中保存用户的登录凭证
  tokenKey: '@MallBrain:token',
  // 用户信息的存储键名，用于在本地存储中保存用户的基本信息
  userKey: '@MallBrain:user',
  // 网络请求最大重试次数，当请求失败时，系统会在达到此次数前自动重试
  maxRetryCount: 3,
};
