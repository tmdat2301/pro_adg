import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native-elements';
import { TextStyle } from 'react-native';
import { color } from '@helpers/index';
import { MyIconProps } from '@components/Icon/until';
import { AppRoutes } from './appRoutes';
import { MyIcon, TabIcon } from '@components/Icon';
import { LeadNavigator } from './lead.navigation';
import { ContactNavigator } from './contact.navigator';
import { EnterpriseNavigator } from './enterprise.navigator';
import { DealNavigator } from './deal.navigator';
import { useTranslation } from 'react-i18next';
import { TabBarVisibilityContext } from '@contexts/index';
import { DashboardNavigator } from './dashboard.navigator';
import AppSpeedDial from '@components/AppSpeedDial';
import SpeedDialAction from '@components/SpeedDialAction';
import { useNavigation } from '@react-navigation/native';

export type AppTabParamList = {
  [AppRoutes.DASHBOARD_TAB]: undefined;
  [AppRoutes.LEAD_TAB]: undefined;
  [AppRoutes.CONTACT_TAB]: undefined;
  [AppRoutes.ENTERPRISE_TAB]: undefined;
  [AppRoutes.DEAL_TAB]: undefined;
  [AppRoutes.CALL_SCREEN]: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

export const AppNavigator = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);
  const [showOpacity, setShowOpacity] = useState(false);
  const navigation = useNavigation();
  const [openSpeedDial, setOpenSpeedDial] = useState(false);

  const onToggle = () => {
    setOpenSpeedDial(!openSpeedDial);
  };
  const setVisibleState = (value: boolean) => {
    setVisible(value);
  };
  const setShowOpacityState = (value: boolean) => {
    setTimeout(
      () => {
        setShowOpacity(value);
      },
      value ? 350 : 0,
    );
  };
  function getNavigatorProps(tabProps: { focused: boolean }) {
    const colorTab = tabProps.focused ? color.primary : color.icon;
    const colorTabOpacity = tabProps.focused ? color.primaryOpacity : color.iconOpacity;
    return {
      icon: {
        fill: showOpacity ? colorTabOpacity : colorTab,
      } as MyIconProps,
      text: {
        color: showOpacity ? colorTabOpacity : colorTab,
        fontSize: 10,
        lineHeight: 18,
        fontFamily: 'OpenSans-Regular',
      } as TextStyle,
    };
  }

  return (
    <TabBarVisibilityContext.Provider
      value={{ visible, setVisible: setVisibleState, showOpacity, setShowOpacity: setShowOpacityState }}>
      <Tab.Navigator
        lazy
        tabBarOptions={{
          allowFontScaling: false,
          style: {
            zIndex: !openSpeedDial ? 2 : undefined,
            paddingTop: 8,
            backgroundColor: showOpacity ? color.whiteOpacity : color.white,
            borderTopWidth: showOpacity ? 0 : 1,
            shadowColor: color.grayShadow,
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 5,
          },
        }}>
        <Tab.Screen
          name={AppRoutes.DASHBOARD_TAB}
          options={{
            tabBarVisible: visible,
            tabBarIcon: (props) => <TabIcon.Dashboard {...getNavigatorProps(props).icon} />,
            tabBarLabel: (props) => <Text style={{ ...getNavigatorProps(props).text }}>{t('tabbar:overview')}</Text>,
          }}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              showOpacity && e.preventDefault();
            },
          })}
          component={DashboardNavigator}
        />
        <Tab.Screen
          name={AppRoutes.LEAD_TAB}
          options={{
            tabBarVisible: visible,
            tabBarIcon: (props) => <TabIcon.Lead {...getNavigatorProps(props).icon} />,
            tabBarLabel: (props) => <Text style={{ ...getNavigatorProps(props).text }}>{t('tabbar:lead')}</Text>,
          }}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              showOpacity && e.preventDefault();
            },
          })}
          component={LeadNavigator}
        />
        <Tab.Screen
          name={AppRoutes.CONTACT_TAB}
          options={{
            tabBarVisible: visible,
            tabBarIcon: (props) => <TabIcon.Contact {...getNavigatorProps(props).icon} />,
            tabBarLabel: (props) => <Text style={{ ...getNavigatorProps(props).text }}>{t('tabbar:contact')}</Text>,
          }}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              showOpacity && e.preventDefault();
            },
          })}
          component={ContactNavigator}
        />
        <Tab.Screen
          name={AppRoutes.ENTERPRISE_TAB}
          options={{
            tabBarVisible: visible,
            tabBarIcon: (props) => <TabIcon.Enterprise {...getNavigatorProps(props).icon} />,
            tabBarLabel: (props) => <Text style={{ ...getNavigatorProps(props).text }}>{t('tabbar:enterprise')}</Text>,
          }}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              showOpacity && e.preventDefault();
            },
          })}
          component={EnterpriseNavigator}
        />
        <Tab.Screen
          name={AppRoutes.DEAL_TAB}
          options={{
            tabBarVisible: visible,
            tabBarIcon: (props) => <TabIcon.Deal {...getNavigatorProps(props).icon} />,
            tabBarLabel: (props) => <Text style={{ ...getNavigatorProps(props).text }}>{t('tabbar:deal')}</Text>,
          }}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              showOpacity && e.preventDefault();
            },
          })}
          component={DealNavigator}
        />
      </Tab.Navigator>
      {visible && (
        <AppSpeedDial
          containerStyle={{ marginBottom: 45 }}
          delayPressIn={500}
          isOpen={openSpeedDial}
          onClose={onToggle}
          onOpen={onToggle}>
          <SpeedDialAction
            icon={<MyIcon.User />}
            title={t('button:add_lead')}
            onPress={() => {
              navigation.navigate(AppRoutes.CREATE_AND_EDIT_LCCD, { type: 'lead' });
              onToggle();
            }}
          />
          <SpeedDialAction
            icon={<TabIcon.Contact fill={color.white} size={16} />}
            title={t('button:add_contact')}
            onPress={() => {
              navigation.navigate(AppRoutes.CREATE_AND_EDIT_LCCD, { type: 'contact' });
              onToggle();
            }}
          />
          <SpeedDialAction
            icon={<TabIcon.Enterprise fill={color.white} size={16} />}
            title={t('button:add_enterprise')}
            onPress={() => {
              navigation.navigate(AppRoutes.CREATE_AND_EDIT_LCCD, { type: 'corporate' });
              onToggle();
            }}
          />
          <SpeedDialAction
            icon={<TabIcon.Deal fill={color.white} size={16} />}
            title={t('button:add_deal')}
            onPress={() => {
              navigation.navigate(AppRoutes.CREATE_AND_EDIT_LCCD, { type: 'deal' });
              onToggle();
            }}
          />
          <SpeedDialAction
            icon={<MyIcon.CarryOut />}
            title={t('button:add_task')}
            onPress={() => {
              navigation.navigate(AppRoutes.CREATE_AND_EDIT_TASK);
              onToggle();
            }}
          />
          <SpeedDialAction
            icon={<MyIcon.Calendar />}
            title={t('button:add_appointment')}
            onPress={() => {
              navigation.navigate(AppRoutes.CREATE_AND_EDIT_APPOINTMENT);
              onToggle();
            }}
          />
          <SpeedDialAction
            onPress={() => {
              navigation.navigate(AppRoutes.PHONEBOOK);
              onToggle();
            }}
            icon={<MyIcon.Phone />}
            title={t('button:call')}
          />
        </AppSpeedDial>
      )}
    </TabBarVisibilityContext.Provider>
  );
};
