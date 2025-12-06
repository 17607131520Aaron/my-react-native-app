import request from 'axios';

import { APP_CONFIG, getApiConfig } from '~/common/config';
import { addNetworkListener, isNetworkConnected } from '~/utils/network';

import { logger } from './logger';
import { getStorageItem } from './storage';

import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { IErrorMessage, IRequestConfig, IResponse } from '~/types/request';

// 请求队列，用于离线情况下缓存请求
interface IQueuedRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  config: IRequestConfig<unknown>;
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  timestamp: number;
}

// 请求队列
const requestQueue: IQueuedRequest[] = [];
let isProcessingQueue = false;

// 统一错误处理
const handleError = (status: number, data: IResponse, isSkipErrorMessage = false): void => {
  const errorMessages: Record<number, IErrorMessage> = {
    401: {
      message: '提示',
      description: '登录超时，请重新登录',
      action: () => {
        // 处理登录超时，例如重定向到登录页面
        // 可以考虑使用导航或Redux清除用户状态
      },
    },
    403: {
      message: '权限错误',
      description: '您没有权限访问该资源',
    },
    404: {
      message: '系统提示',
      description: '访问地址不存在，请联系管理员',
    },
    500: {
      message: '系统错误',
      description: data?.message || '服务器内部错误',
    },
  };

  const error = errorMessages[status] || {
    message: '错误',
    description: data?.message || '系统异常',
  };

  if (!isSkipErrorMessage) {
    // ToastView.add(error.description);
  }

  if (error.action) {
    error.action();
  }
};

// 统一响应处理
const parse = <R>(
  res: AxiosResponse,
  params: { isHandleRaw: boolean; isSkipErrorMessage: boolean },
): R => {
  const { status, data } = res;
  const { isHandleRaw, isSkipErrorMessage } = params;

  if (status === 200) {
    if (isHandleRaw) {
      return data as R;
    }
    if (data.code === 0) {
      return data.data as R;
    }
    handleError(status, data, isSkipErrorMessage);
    return data.data as R;
  }

  handleError(status, data, isSkipErrorMessage);
  return data.data as R;
};

// 获取API配置
const apiConfig = getApiConfig();

// 创建Axios实例
const instance = request.create({
  timeout: apiConfig.timeout,
  baseURL: apiConfig.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
instance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // 从存储中获取token
      const token = await getStorageItem<string>('token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      logger.error('Error getting token from storage', { error: String(error) });
    }

    // 添加请求日志
    logger.info(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      method: config.method?.toUpperCase(),
      url: config.url,
    });

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 添加响应日志
    logger.info(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      method: response.config.method?.toUpperCase(),
      url: response.config.url,
      status: response.status,
    });

    // 计算请求耗时
    const requestTime = response.headers['x-request-time'];
    if (requestTime) {
      const responseTime = new Date().getTime();
      const duration = responseTime - parseInt(requestTime, 10);
      logger.info(`API Request duration`, { duration: `${duration}ms` });
    }

    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const { status, data, config } = error.response;
      logger.error(`API Error: ${config.method?.toUpperCase()} ${config.url}`, {
        method: config.method?.toUpperCase(),
        url: config.url,
        status,
      });

      handleError(status, data as IResponse);
    } else if (error.request) {
      logger.error('API Network Error', { message: error.message });
      // ToastView.add('网络错误，请检查您的网络连接');
    } else {
      logger.error('API Request Error', { message: error.message });
      // ToastView.add('请求错误，请稍后重试');
    }
    return Promise.reject(error);
  },
);

// 添加网络监听器以处理队列
addNetworkListener(async (state) => {
  if (state.isConnected && requestQueue.length > 0) {
    await processQueue();
  }
});

// 处理请求队列
const processQueue = async (): Promise<void> => {
  if (isProcessingQueue || requestQueue.length === 0) {
    return;
  }

  isProcessingQueue = true;

  // 检查网络连接
  const isConnected = await isNetworkConnected();
  if (!isConnected) {
    isProcessingQueue = false;
    return;
  }

  while (requestQueue.length > 0) {
    const queuedRequest = requestQueue.shift();
    if (!queuedRequest) continue;

    const { method, config, resolve, reject } = queuedRequest;

    try {
      const result = await requestMethod(method, { ...config, isSkipNetworkCheck: true });
      resolve(result);
    } catch (error) {
      reject(error);
    }
  }

  isProcessingQueue = false;
};

// 请求方法
const requestMethod = async <T, R>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  config: IRequestConfig<T>,
): Promise<R> => {
  const {
    retry = APP_CONFIG.maxRetryCount,
    isSkipNetworkCheck = false,
    isSkipErrorMessage = false,
  } = config;

  // 检查网络连接
  if (!isSkipNetworkCheck) {
    const isConnected = await isNetworkConnected();
    if (!isConnected) {
      // 添加到队列
      return new Promise<R>((resolve, reject) => {
        const queueRequest: IQueuedRequest = {
          method,
          config: config as IRequestConfig<unknown>,
          resolve: resolve as unknown as (value: unknown) => void,
          reject,
          timestamp: new Date().getTime(),
        };
        requestQueue.push(queueRequest);
        // ToastView.add('当前网络不可用，请求将在恢复连接后自动发送');
      });
    }
  }

  let attempts = 0;

  while (attempts <= retry) {
    try {
      const {
        url,
        data,
        isHandleRaw = false,
        timeout = apiConfig.timeout,
        cancelToken,
        headers,
      } = config;

      // 添加请求耗时计算的header
      const customHeaders = {
        'x-request-time': new Date().getTime().toString(),
        ...headers,
      };

      const response = await instance({
        method,
        url,
        [method === 'GET' ? 'params' : 'data']: data,
        timeout,
        signal: cancelToken?.signal,
        headers: customHeaders,
      });

      return parse<R>(response, { isHandleRaw, isSkipErrorMessage });
    } catch (error) {
      attempts++;
      if (attempts > retry) {
        return Promise.reject(error);
      }

      // 等待一段时间后重试
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
    }
  }

  throw new Error('请求失败，已达到最大重试次数');
};

// 导出请求方法
const get = <T, R>(config: IRequestConfig<T>): Promise<R> => requestMethod<T, R>('GET', config);

const post = <T, R>(config: IRequestConfig<T>): Promise<R> => requestMethod<T, R>('POST', config);

const put = <T, R>(config: IRequestConfig<T>): Promise<R> => requestMethod<T, R>('PUT', config);

const del = <T, R>(config: IRequestConfig<T>): Promise<R> => requestMethod<T, R>('DELETE', config);

// 文件上传
const uploadFile = async <R>(options: {
  url: string;
  file: unknown;
  name?: string;
  data?: Record<string, unknown>;
  onProgress?: (progress: number) => void;
}): Promise<R> => {
  const { url, file, name = 'file', data = {}, onProgress } = options;

  const formData = new FormData();
  formData.append(name, file as Blob);

  // 添加额外的表单数据
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key] as string);
  });

  // 检查网络连接
  const isConnected = await isNetworkConnected();
  if (!isConnected) {
    // ToastView.add('当前网络不可用，无法上传文件');
    return Promise.reject(new Error('网络不可用'));
  }

  try {
    const response = await instance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });

    return parse<R>(response, { isHandleRaw: false, isSkipErrorMessage: false });
  } catch (error) {
    // ToastView.add('文件上传失败');
    return Promise.reject(error);
  }
};

export { del, get, post, put, uploadFile };
