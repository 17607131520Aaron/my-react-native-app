import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';

import { initEnvironment } from '~/common/config';
import AboutPage from '~/pages/About';

const Stack = createNativeStackNavigator();

const App = (): React.JSX.Element => {
  // 处理app进入的主入口

  // 初始化环境配置（从存储中读取之前保存的环境设置）
  useEffect(() => {
    initEnvironment().catch((error) => {
      console.error('Failed to initialize environment:', error);
    });
  }, []);

  const getScreenConfig = (): { component: React.ComponentType; name: string } => {
    // 根据不同的用户角色权限进入不同的模块页面
    return {
      component: AboutPage,
      name: 'App',
    };
  };

  const { component, name } = getScreenConfig();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen component={component} name={name} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
