/**
 * 我的 Tab Screen
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { mineDefaultOptions, mineRoutes } from '~/routers/mine';

import type { IMineStackParamList } from '~/routers/types';

const Stack = createNativeStackNavigator<IMineStackParamList>();

export const MineScreen = (): React.JSX.Element => {
  return (
    <Stack.Navigator screenOptions={mineDefaultOptions}>
      {mineRoutes.map((route) => (
        <Stack.Screen
          key={route.name}
          component={route.component}
          name={route.name}
          options={route.options}
        />
      ))}
    </Stack.Navigator>
  );
};
