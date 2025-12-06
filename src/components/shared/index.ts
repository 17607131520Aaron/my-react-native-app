/**
 * 共享组件统一导出
 */

export {
  ErrorBoundary,
  ErrorFallback,
  type IErrorBoundaryProps,
  type IErrorBoundaryState,
  type IErrorFallbackProps,
} from './ErrorBoundary';

export {
  NavigationBar,
  withNavigationBar,
  useNavigationBar,
  type INavigationBarProps,
  type INavBarButton,
  type INavBarSearchConfig,
  type IWithNavigationBarProps,
  type IBackIconConfig,
} from './NavigationBar';

export { SplashScreen, type ISplashScreenProps } from './SplashScreen';
