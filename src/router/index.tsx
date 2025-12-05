/**
 * 路由配置
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

// Pages
import Home from '@/pages/home';
import WebViewPage from '@/pages/webview';

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: '#007AFF' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ title: '首页' }}
      />
      <Stack.Screen
        name="WebView"
        component={WebViewPage}
        options={({ route }) => ({ title: route.params?.title || '网页' })}
      />
    </Stack.Navigator>
  );
}

export default RootNavigator;
