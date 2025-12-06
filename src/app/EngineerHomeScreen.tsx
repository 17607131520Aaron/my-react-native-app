/**
 * 工程师首页 Tab Screen
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { engineerDefaultOptions, engineerRoutes } from '~/routers/engineer';

import type { IEngineerStackParamList } from '~/routers/types';

const Stack = createNativeStackNavigator<IEngineerStackParamList>();

export const EngineerHomeScreen = (): React.JSX.Element => {
  return (
    <Stack.Navigator screenOptions={engineerDefaultOptions}>
      {engineerRoutes.map((route) => (
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
