import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRoutes } from './appRoutes';
import ListContactScreen from '@screen/ListContactScreen';


export type ContactStackParamList = {
  [AppRoutes.LIST_CONTACT]: undefined;
  [AppRoutes.FILTER]: undefined;
};

const Stack = createStackNavigator<ContactStackParamList>();

export const ContactNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen name={AppRoutes.LIST_CONTACT} component={ListContactScreen} />
  </Stack.Navigator>
);
