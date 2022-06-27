import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRoutes } from './appRoutes';
import { Home } from '@screen/index';
import PaymentScreen from '@screen/PaymentScreen';
import CallHistory from '@screen/CallHistoryScreen';
import CallHistorySearch from '@screen/CallHistorySearch';
import ContactScreen from '@screen/ContactScreen';
import DateTime from '@screen/DateTimeScreen';
import SearchUserByOrganization from '@screen/SearchUserByOrganization';
import ProFileScreen from '@screen/ProFileScreen';
import CallScreen from '@screen/CallScreen/index.tsx';

export type DashboardStackParamList = {
  [AppRoutes.DASHBOARD]: undefined;
  [AppRoutes.CREATE_PAYMENT_REQUEST]: undefined;
  [AppRoutes.PHONEBOOK]: undefined;
  [AppRoutes.SEARCH_PHONE]: undefined;
  [AppRoutes.DETAIL_PHONEBOOK]: undefined;
  [AppRoutes.DATETIME]: undefined;
  [AppRoutes.SEARCH_USER_BY_ORGANIZATION]: undefined;
  [AppRoutes.PROFILE]: undefined;
};

const Stack = createStackNavigator<DashboardStackParamList>();

export const DashboardNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen name={AppRoutes.DASHBOARD} component={Home} />
  </Stack.Navigator>
);
