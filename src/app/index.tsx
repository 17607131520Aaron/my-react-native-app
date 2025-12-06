/**
 * App 入口组件
 * 根据用户角色动态显示不同的底部导航栏
 * 所有模块的页面都注册在根 Stack 中，支持跨模块跳转
 */

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';

import { initEnvironment } from '~/common/config';
import { allRoutes } from '~/routers';
import { type TUserRole, useUserStore } from '~/store';

import type { IAllRoutesParamList } from '~/routers/types';

// ==================== 样式 ====================
const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 20,
  },
});

// ==================== Tab 图标组件 ====================
const TabIcon = ({ color, icon }: { color: string; icon: string }): React.JSX.Element => (
  <Text style={[styles.tabIcon, { color }]}>{icon}</Text>
);

// ==================== 根 Stack Navigator（注册所有页面） ====================
type TRootStackParamList = IAllRoutesParamList & {
  MainTabs: undefined;
  [key: string]: object | undefined;
};
const RootStack = createNativeStackNavigator<TRootStackParamList>();

// ==================== Tab 导航类型 ====================
interface IMainTabParamList {
  EngineerHomeTab: undefined;
  InstitutionHomeTab: undefined;
  MineTab: undefined;
  [key: string]: object | undefined;
}
const MainTab = createBottomTabNavigator<IMainTabParamList>();

// ==================== 通用 Tab 配置 ====================
const defaultTabScreenOptions = {
  headerShown: false,
  tabBarActiveTintColor: '#007AFF',
  tabBarInactiveTintColor: '#8E8E93',
};

// ==================== Tab 配置 ====================
interface ITabConfig {
  name: keyof IMainTabParamList;
  label: string;
  icon: string;
  initialRoute: string;
}

const TAB_CONFIGS: Record<string, ITabConfig> = {
  engineer: {
    name: 'EngineerHomeTab',
    label: '工作台',
    icon: '🔧',
    initialRoute: 'EngineerHome',
  },
  institution: {
    name: 'InstitutionHomeTab',
    label: '机构',
    icon: '🏢',
    initialRoute: 'InstitutionHome',
  },
  mine: {
    name: 'MineTab',
    label: '我的',
    icon: '👤',
    initialRoute: 'About',
  },
};

// 根据角色获取 Tab 配置
const getTabsByRole = (role: TUserRole | null): ITabConfig[] => {
  switch (role) {
    case 'engineer':
      return [TAB_CONFIGS.engineer, TAB_CONFIGS.mine];
    case 'institution':
      return [TAB_CONFIGS.institution, TAB_CONFIGS.mine];
    case 'admin':
      return [TAB_CONFIGS.engineer, TAB_CONFIGS.institution, TAB_CONFIGS.mine];
    default:
      return [TAB_CONFIGS.institution, TAB_CONFIGS.mine];
  }
};

// ==================== Tab 首页占位组件 ====================
// 这些组件只是 Tab 的入口，实际页面由根 Stack 管理
const createTabScreen = (initialRoute: string): React.ComponentType => {
  const TabScreen = (): null => null;
  TabScreen.displayName = `TabScreen_${initialRoute}`;
  return TabScreen;
};

// ==================== 动态 Tab 导航器 ====================
const MainTabNavigator = (): React.JSX.Element => {
  const { role } = useUserStore();
  const tabs = useMemo(() => getTabsByRole(role), [role]);

  return (
    <MainTab.Navigator screenOptions={defaultTabScreenOptions}>
      {tabs.map((tab) => (
        <MainTab.Screen
          key={tab.name}
          component={createTabScreen(tab.initialRoute)}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              // 跳转到对应的首页
              navigation.navigate(tab.initialRoute);
            },
          })}
          name={tab.name}
          options={{
            tabBarLabel: tab.label,
            tabBarIcon: ({ color }) => <TabIcon color={color} icon={tab.icon} />,
          }}
        />
      ))}
    </MainTab.Navigator>
  );
};

// ==================== 主应用组件 ====================
const App = (): React.JSX.Element => {
  const { isAuthenticated } = useUserStore();

  // 初始化环境配置
  useEffect(() => {
    initEnvironment().catch((error) => {
      console.error('Failed to initialize environment:', error);
    });
  }, []);

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            {/* Tab 导航作为首页 */}
            <RootStack.Screen component={MainTabNavigator} name='MainTabs' />
            {/* 动态注册所有模块的页面 */}
            {allRoutes.map((route) => (
              <RootStack.Screen
                key={route.name}
                component={route.component}
                name={route.name}
                options={route.options}
              />
            ))}
          </>
        ) : (
          <>
            {/* 未登录时只显示登录相关页面 */}
            {allRoutes
              .filter((route) => ['Login', 'About'].includes(route.name as string))
              .map((route) => (
                <RootStack.Screen
                  key={route.name}
                  component={route.component}
                  name={route.name}
                  options={route.options}
                />
              ))}
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default App;
