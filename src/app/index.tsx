/**
 * App 入口组件
 * 根据用户角色动态显示不同的底部导航栏
 */

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

import colors from '~/common/colors';
import { ErrorBoundary } from '~/components/shared';
import { useUserStore } from '~/store';
import { ThemeProvider } from '~/theme';

import { getTabsByRole } from './tabConfigs';

import type { TMainTabParamList } from './types';

// ==================== 样式 ====================
const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 20,
  },
});

// ==================== Tab Navigator ====================
const Tab = createBottomTabNavigator<TMainTabParamList>();

const defaultTabScreenOptions = {
  headerShown: false,
  tabBarActiveTintColor: colors.tabActive,
  tabBarInactiveTintColor: colors.tabInactive,
};

// ==================== 主应用内容组件 ====================
const AppContent = (): React.JSX.Element => {
  const { role } = useUserStore();

  // 已登录根据角色显示对应的底部导航
  const tabs = getTabsByRole(role);

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={defaultTabScreenOptions}>
        {tabs.map((tab) => (
          <Tab.Screen
            key={tab.name}
            component={tab.component}
            name={tab.name}
            options={{
              tabBarLabel: tab.label,
              tabBarIcon: ({ color }) => (
                <Text style={[styles.tabIcon, { color }]}>{tab.icon}</Text>
              ),
            }}
          />
        ))}
      </Tab.Navigator>
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
