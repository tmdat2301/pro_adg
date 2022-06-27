import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRoutes } from './appRoutes';
import ListDealScreen from '@screen/ListDealScreen';
import Filter from '@screen/ListLeadScreen/components/Filter';

export type DealStackParamList = {
  [AppRoutes.LIST_DEAL]: undefined;
  [AppRoutes.FILTER]: undefined;

};

const Stack = createStackNavigator<DealStackParamList>();

export const DealNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen name={AppRoutes.LIST_DEAL} component={ListDealScreen} />

  </Stack.Navigator>
);
