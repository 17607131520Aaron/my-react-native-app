/**
 * App 入口组件
 * 使用 Root Stack + Tab Navigator 架构支持跨模块导航
 */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { ErrorBoundary, NavigationBar } from '~/components/shared';
import { getAllRoutes, type IRootStackParamList } from '~/routers';
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
  const allRoutes = getAllRoutes();

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
        {allRoutes.map((route) => (
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
    <ErrorBoundary>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
