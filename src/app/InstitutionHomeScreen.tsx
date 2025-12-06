/**
 * 机构首页 Tab Screen
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { institutionDefaultOptions, institutionRoutes } from '~/routers/institution';

import type { IInstitutionStackParamList } from '~/routers/types';

const Stack = createNativeStackNavigator<IInstitutionStackParamList>();

export const InstitutionHomeScreen = (): React.JSX.Element => {
  return (
    <Stack.Navigator screenOptions={institutionDefaultOptions}>
      {institutionRoutes.map((route) => (
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
