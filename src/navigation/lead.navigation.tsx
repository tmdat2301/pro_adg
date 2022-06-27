import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRoutes } from './appRoutes';
import ListLeadScreen from '@screen/ListLeadScreen';
import Filter from '@screen/ListLeadScreen/components/Filter';
import { Home } from '@screen/index';

export type LeadStackParamList = {
  [AppRoutes.LIST_LEAD]: undefined;
  [AppRoutes.FILTER]: undefined;
};

const Stack = createStackNavigator<LeadStackParamList>();

export const LeadNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen name={AppRoutes.LIST_LEAD} component={ListLeadScreen} />

  </Stack.Navigator>
);
