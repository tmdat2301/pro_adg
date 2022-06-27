import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRoutes } from './appRoutes';
import CallScreen from '@screen/CallScreen/index.tsx';

export type DealStackParamList = {
    [AppRoutes.CALL]: undefined;
};

const Stack = createStackNavigator<DealStackParamList>();

export const DealNavigator = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}>
        <Stack.Screen name={AppRoutes.CALL} component={CallScreen} />
    </Stack.Navigator>
);
