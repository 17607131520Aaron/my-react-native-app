/**
 * App 入口组件
 * 根据用户角色动态显示不同的底部导航栏
 */

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';

import { initEnvironment } from '~/common/config';
import LoginPage from '~/pages/Login';
import { useUserStore } from '~/store';

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
  tabBarActiveTintColor: '#007AFF',
  tabBarInactiveTintColor: '#8E8E93',
};

// ==================== 主应用组件 ====================
const App = (): React.JSX.Element => {
  const { isAuthenticated, role } = useUserStore();

  useEffect(() => {
    initEnvironment().catch((error) => {
      console.error('Failed to initialize environment:', error);
    });
  }, []);

  // 未登录显示登录页
  if (!isAuthenticated) {
    return (
      <NavigationContainer>
        <LoginPage />
      </NavigationContainer>
    );
  }

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

export default App;
