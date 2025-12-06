/**
 * 错误边界类型定义
 */

import type { ErrorInfo, ReactNode } from 'react';

/** 错误边界属性 */
export interface IErrorBoundaryProps {
  /** 子组件 */
  children: ReactNode;
  /** 自定义降级 UI */
  fallback?: ReactNode;
  /** 错误回调 */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** 重试回调 */
  onRetry?: () => void;
}

/** 错误边界状态 */
export interface IErrorBoundaryState {
  /** 是否有错误 */
  hasError: boolean;
  /** 错误对象 */
  error: Error | null;
}
