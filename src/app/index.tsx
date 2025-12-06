/**
 * App 入口组件
 * 使用 Root Stack + Tab Navigator 架构支持跨模块导航
 */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ErrorBoundary, NavigationBar, SplashScreen } from '~/components/shared';
import { getAllRoutes, type IRootStackParamList, IRouteConfig } from '~/routers';
import { navigationRef } from '~/routers/navigation';
import { ThemeProvider } from '~/theme';

import { MainTabsScreen } from './MainTabs';

import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

// ==================== Root Stack Navigator ====================
const RootStack = createNativeStackNavigator<IRootStackParamList>();

// 默认导航选项
// 使用自定义 NavigationBar 组件替代原生 header
const defaultScreenOptions: NativeStackNavigationOptions = {
  headerShown: true,
  animation: 'slide_from_right',
  header: ({ options }) => (
    <NavigationBar
      showBack
      showBorder={false}
      title={typeof options.title === 'string' ? options.title : undefined}
    />
  ),
};

// ==================== 主应用内容组件 ====================
const AppContent = (): React.JSX.Element => {
  const [isReady, setIsReady] = useState(false);
  const [routes, setRoutes] = useState<IRouteConfig[]>([]);

  useEffect(() => {
    // 延迟初始化路由，确保所有模块加载完成
    const initApp = async (): Promise<void> => {
      try {
        // 获取所有路由
        const allRoutes = getAllRoutes();
        setRoutes(allRoutes);
        setIsReady(true);
      } catch (error) {
        console.error('App initialization error:', error);
        setIsReady(true);
      }
    };

    initApp();
  }, []);

  // 显示启动屏
  if (!isReady) {
    return <SplashScreen appName='仓储管理' subtitle='智能仓储解决方案' />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator screenOptions={defaultScreenOptions}>
        {/* MainTabs 作为第一个 Screen */}
        <RootStack.Screen
          component={MainTabsScreen}
          name='MainTabs'
          options={{ headerShown: false }}
        />

        {/* 动态注册所有其他页面 */}
        {routes.map((route) => (
          <RootStack.Screen
            key={route.name}
            component={route.component}
            name={route.name}
            options={route.options}
          />
        ))}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

// ==================== 主应用组件 ====================
const App = (): React.JSX.Element => {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
};

export default App;
