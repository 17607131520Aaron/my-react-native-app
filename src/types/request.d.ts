// 响应数据接口
export interface IResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
}

// 错误消息接口
export interface IErrorMessage {
  message: string;
  description: string;
  action?: () => void;
}

// 请求配置接口
export interface IRequestConfig<T> {
  url: string;
  data?: T;
  isHandleRaw?: boolean;
  timeout?: number;
  cancelToken?: AbortController;
  retry?: number;
  headers?: Record<string, string>;
  isSkipNetworkCheck?: boolean; // 是否跳过网络检查
  isSkipErrorMessage?: boolean; // 是否跳过错误消息
}
