import React, { useContext, useEffect, useMemo, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootState } from '@redux/reducers';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { AppRoutes } from './appRoutes';
import { SignInScreen } from '@screen/index';
import { AppNavigator } from './app.navigator';
import { TransitionSpec } from '@react-navigation/stack/lib/typescript/src/types';
import ListSearch from '@screen/ListSearch';
import Notification from '@screen/NotificationScreen';
import DetailsLeadScreen from '@screen/DetailsLeadScreen';
import DetailsDealScreen from '@screen/DetailsDealScreen';
import { CreateAndEditTask } from '@screen/index';
import DetailMeetingScreen from '@screen/DetailMeetingScreen';
import DetailsContactScreen from '@screen/DetailsContactScreen';
import DetailsCorporateScreen from '@screen/DetailsCorporateScreen';
import CallScreen from '@screen/CallScreen';
import CostScreen from '@screen/CostScreen';
import CreateAndEditAppointment from '@screen/CreateAndEditAppointment';
import CreateAndEditScreen from '@screen/CreateAndEditScreen';
import ConvertLeadScreen from '@screen/ConvertLeadScreen';
import PaymentScreen from '@screen/PaymentScreen';
import CallHistory from '@screen/CallHistoryScreen';
import CallHistorySearch from '@screen/CallHistorySearch';
import ContactScreen from '@screen/ContactScreen';
import DateTime from '@screen/DateTimeScreen';
import SearchUserByOrganization from '@screen/SearchUserByOrganization';
import ProFileScreen from '@screen/ProFileScreen';
import Filter from '@screen/ListLeadScreen/components/Filter';
import { SocketEvent } from '@helpers/constants';
import { SocketContext, SocketIo } from '@services/socketHandle';
import env from '@config/env';
import CheckConnection from '@hooks/ConnectionCheck';
import NetInfo from '@react-native-community/netinfo';
import ErrorCard from '@screen/NetworkErrorScreen';

const RootStack = createStackNavigator();
const AppStack = createStackNavigator();

export const animationConfig: TransitionSpec = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

const AppStackScreen = () => {
  return (
    <AppStack.Navigator
      headerMode="none"
      defaultScreenOptions={{
        animationEnabled: true,
        transitionSpec: { close: animationConfig, open: animationConfig },
      }}>
      <AppStack.Screen
        name={AppRoutes.APP}
        component={AppNavigator}
        options={{
          animationEnabled: true,
        }}
      />
      <AppStack.Screen name={AppRoutes.CREATE_PAYMENT_REQUEST} component={PaymentScreen} />
      <AppStack.Screen name={AppRoutes.PHONEBOOK} component={CallHistory} />
      <AppStack.Screen name={AppRoutes.SEARCH_PHONE} component={CallHistorySearch} />
      <AppStack.Screen name={AppRoutes.DETAIL_PHONEBOOK} component={ContactScreen} />
      <AppStack.Screen name={AppRoutes.DATETIME} component={DateTime} />
      <AppStack.Screen name={AppRoutes.SEARCH_USER_BY_ORGANIZATION} component={SearchUserByOrganization} />
      <AppStack.Screen name={AppRoutes.PROFILE} component={ProFileScreen} />
      <AppStack.Screen name={AppRoutes.FILTER} component={Filter} />
      <AppStack.Screen
        name={AppRoutes.SEARCH_LEAD}
        component={ListSearch}
        options={{
          animationEnabled: true,
        }}
      />
      <AppStack.Screen
        name={AppRoutes.NOTIFICATION}
        component={Notification}
        options={{
          animationEnabled: true,
        }}
      />
      <AppStack.Screen
        name={AppRoutes.DETAIL_CONTACT}
        component={DetailsContactScreen}
        options={{
          animationEnabled: true,
        }}
      />
      <AppStack.Screen
        name={AppRoutes.DETAIL_CORPORATE}
        component={DetailsCorporateScreen}
        options={{
          animationEnabled: true,
        }}
      />
      <AppStack.Screen
        name={AppRoutes.DETAIL_DEAL}
        component={DetailsDealScreen}
        options={{
          animationEnabled: true,
        }}
      />
      <AppStack.Screen
        name={AppRoutes.DETAIL_LEAD}
        component={DetailsLeadScreen}
        options={{
          animationEnabled: true,
        }}
      />
      <AppStack.Screen
        name={AppRoutes.DETAIL_MEETING}
        component={DetailMeetingScreen}
        options={{
          animationEnabled: true,
        }}
      />
      <AppStack.Screen
        name={AppRoutes.COST}
        component={CostScreen}
        options={{
          animationEnabled: true,
        }}
      />
      <AppStack.Screen
        name={AppRoutes.CREATE_AND_EDIT_TASK}
        component={CreateAndEditTask}
        options={{
          animationEnabled: true,
        }}
      />
      <AppStack.Screen
        name={AppRoutes.CALL}
        component={CallScreen}
        options={{
          gestureEnabled: false,
          animationEnabled: true,
        }}
      />

      <AppStack.Screen
        name={AppRoutes.CREATE_AND_EDIT_APPOINTMENT}
        component={CreateAndEditAppointment}
        options={{
          animationEnabled: true,
        }}
      />
      <AppStack.Screen
        name={AppRoutes.CREATE_AND_EDIT_LCCD}
        component={CreateAndEditScreen}
        options={{
          animationEnabled: true,
        }}
      />
      <AppStack.Screen
        name={AppRoutes.CONVERT_LEAD}
        component={ConvertLeadScreen}
        options={{
          animationEnabled: true,
        }}
      />
    </AppStack.Navigator>
  );
};

const RootStackScreen = () => {
  const userReducer = useSelector((state: RootState) => state.userReducer);
  const isLogin = !_.isEmpty(userReducer.data);
  const userInfo = useMemo(() => userReducer?.data || {}, [userReducer]);
  const socketInstance = useContext(SocketContext);
  const netInfo = NetInfo.useNetInfo();

  useEffect(() => {
    if (isLogin) {
      socketInstance.connect();
    } else {
      socketInstance.offEvent(SocketEvent.NewNotification);
      socketInstance.disconnect();
    }
  }, [isLogin]);

  if (netInfo.isConnected === false) {
    return <ErrorCard />;
  }

  return (
    <SocketContext.Provider
      value={
        new SocketIo(env.WS_ENDPONIT, {
          id: userInfo?.sub,
          name: userInfo?.name,
          domain: env.ADG_SOCKET_DOMAIN,
        })
      }>
      <RootStack.Navigator
        headerMode="none"
        defaultScreenOptions={{
          animationEnabled: true,
          transitionSpec: { close: animationConfig, open: animationConfig },
        }}>
        {isLogin ? (
          <RootStack.Screen
            name={AppRoutes.UNAUTH}
            component={AppStackScreen}
            options={{
              animationEnabled: true,
            }}
          />
        ) : (
          <RootStack.Screen
            name={AppRoutes.AUTH}
            component={SignInScreen}
            options={{
              animationEnabled: true,
            }}
          />
        )}
      </RootStack.Navigator>
    </SocketContext.Provider>
  );
};
export default RootStackScreen;
