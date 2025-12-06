/**
 * 错误边界组件
 * 捕获子组件树中的 JavaScript 错误并显示降级 UI
 */

import { Component, type ErrorInfo, type ReactNode } from 'react';

import { logger } from '../../../utils/logger';

import { ErrorFallback } from './ErrorFallback';

import type { IErrorBoundaryProps, IErrorBoundaryState } from './types';

/**
 * ErrorBoundary 类组件
 * React 要求错误边界必须是类组件
 */
export class ErrorBoundary extends Component<IErrorBoundaryProps, IErrorBoundaryState> {
  constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  /**
   * 从错误中派生状态
   */
  static getDerivedStateFromError(error: Error): IErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * 捕获错误并记录日志
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error('ErrorBoundary 捕获到错误', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    this.props.onError?.(error, errorInfo);
  }

  /**
   * 重试处理
   */
  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
    this.props.onRetry?.();
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }
      return <ErrorFallback error={error} onRetry={this.handleRetry} />;
    }

    return children;
  }
}
