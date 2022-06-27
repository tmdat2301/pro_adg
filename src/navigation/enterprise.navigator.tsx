import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRoutes } from './appRoutes';
import ListInterpriseScreen from '@screen/ListInterpriseScreen';
import Filter from '@screen/ListLeadScreen/components/Filter';

export type EnterpriseStackParamList = {
  [AppRoutes.LIST_ENTERPRISE]: undefined;
  [AppRoutes.FILTER]: undefined;
};

const Stack = createStackNavigator<EnterpriseStackParamList>();

export const EnterpriseNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen name={AppRoutes.LIST_ENTERPRISE} component={ListInterpriseScreen} />

  </Stack.Navigator>
);
