/**
 * MainTabs 组件
 * 底部 Tab 导航器，作为 Root Stack 的一个 Screen
 */

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { useUserStore } from '~/store';

import { getTabsByRole } from './tabConfigs';

import type { IMainTabParamList } from './types';

const Tab = createBottomTabNavigator<IMainTabParamList>();

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 20,
  },
});

/**
 * MainTabs Screen
 * 根据用户角色动态渲染底部 Tab
 */
export const MainTabsScreen = (): React.JSX.Element => {
  const { role } = useUserStore();
  const tabs = getTabsByRole(role);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}
    >
      {tabs.map((tab) => (
        <Tab.Screen
          key={tab.name}
          component={tab.component}
          name={tab.name}
          options={{
            tabBarLabel: tab.label,
            tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>{tab.icon}</Text>,
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default MainTabsScreen;
