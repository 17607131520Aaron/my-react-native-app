import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';

import { initEnvironment } from '~/common/config';
import { allRoutes } from '~/routers';

import type { IAllRoutesParamList } from '~/routers/types';

const Stack = createNativeStackNavigator<IAllRoutesParamList>();

const App = (): React.JSX.Element => {
  // 初始化环境配置（从存储中读取之前保存的环境设置）
  useEffect(() => {
    initEnvironment().catch((error) => {
      console.error('Failed to initialize environment:', error);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='About' screenOptions={{ headerShown: false }}>
        {allRoutes.map((route) => (
          <Stack.Screen
            key={route.name}
            component={route.component}
            name={route.name}
            options={route.options}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
