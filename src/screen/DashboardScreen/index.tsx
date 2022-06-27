import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View, LayoutChangeEvent, StyleProp, GestureResponderEvent, StatusBar } from 'react-native';
import styles from './styles';
import { fontSize, padding } from '@helpers/index';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@components/index';
import { AppContext, TabBarVisibilityContext } from '@contexts/index';
import { useIsFocused, useNavigation } from '@react-navigation/core';
import { useDispatch, useSelector } from 'react-redux';
import { getMapKeyRequest, getProfileUserRequest, logout } from '@redux/actions/userActions';
import { RootState } from '@redux/reducers';
import ModalPickerCategory from './components/ModalPickerCategory';
import dayjs from 'dayjs';

import { TabView } from 'react-native-elements';
import { isIOS, ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';
import { Modalize } from 'react-native-modalize';

import ModalInfo from './components/ModalInfo';
import ActivityTab from './tabs/ActivityTab';
import BusinessTab from './tabs/BusinessTab';
import { AppRoutes } from '@navigation/appRoutes';
import { DATE_FORMAT, SocketEvent } from '@helpers/constants';
import {
  getOrganizationRequest,
  organizationDropDownRequest,
  setOrganizationFilter,
} from '@redux/actions/filterActions';
import { ItemOrganization } from '@interfaces/dashboard.interface';
import AppFilterByOrganizationUnit from '@components/AppFilterByOrganizationUnit';
import DashboardHeader from './components/DashboardHeader';
import * as filterActions from '@redux/actions/filterActions';
import { setNotificationUnread } from '@redux/actions/notificationActions';
import { PERMISSIONS, request } from 'react-native-permissions';
import _ from 'lodash';
import Toast from 'react-native-toast-message';
import { SocketContext } from '@services/socketHandle';
import { Host } from 'react-native-portalize';
import NetInfo from '@react-native-community/netinfo';
import actionTypes from '@redux/actionTypes';
import { taskSummarySuccess } from '@redux/actions/businessActions';

const DashboardScreen = () => {
  const userReducer = useSelector((state: RootState) => state.userReducer);

  const navigation = useNavigation();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const bottomSheetModalRef = useRef<Modalize>(null);
  const { setVisible, setShowOpacity } = useContext(TabBarVisibilityContext);
  const isFocused = useIsFocused();
  const [mainLayout, setMainLayout] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 120,
  });
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [modalType, setModalType] = useState<
    'ModalInfo' | 'ModalSelectCategory' | 'ModalSelectTime' | 'ModalValues' | 'ModalFilterByOrganizationUnit'
  >('ModalInfo');
  const filterReducer = useSelector((state: RootState) => state.filterReducer);
  const netInfo = NetInfo.useNetInfo();

  const notiReducer = useSelector((state: RootState) => state.notificationsReducer);
  const socketInstance = useContext(SocketContext);
  const appContext = useContext(AppContext);
  const positionTop: number = mainLayout.height + mainLayout.top + 12;
  const bottomTabBarHeight = isIOS ? 42 : 20;
  const swiperHeight = ScreenHeight - insets.bottom - bottomTabBarHeight - positionTop;
  const contentStyle = {
    position: 'absolute',
    top: positionTop,
    height: swiperHeight,
    width: ScreenWidth,
  } as StyleProp<any>;
  const listOrganizationChild = useRef<ItemOrganization[] | null>(null);

  const closeModal = () => {
    setVisible(true);
  };

  const openModal = (
    type: 'ModalInfo' | 'ModalSelectCategory' | 'ModalSelectTime' | 'ModalValues' | 'ModalFilterByOrganizationUnit',
  ) => {
    setVisible(false);
    setModalType(type);
    bottomSheetModalRef.current?.open();
  };

  const onChangeTab = (index: number) => {
    if (index !== currentTabIndex) {
      setCurrentTabIndex(index);
    }
  };

  const onGetLayout = useCallback((event: LayoutChangeEvent) => {
    const { x, y, height, width } = event.nativeEvent.layout;
    if (height !== mainLayout.height) {
      setMainLayout({
        left: x,
        top: y,
        width: width,
        height: height,
      });
    }
  }, []);

  const renderModalHeader = (name: string) => {
    return (
      <View style={styles.modalHeader}>
        <AppText fontSize={fontSize.f24}>{name[0].toLocaleUpperCase() ?? ''}</AppText>
      </View>
    );
  };

  useEffect(() => {
    const requestPermissionLocation = async () => {
      return await request(isIOS ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    };
    if (netInfo.isConnected === true) {
      appContext.setLoading(true);
      dispatch(getOrganizationRequest());
      dispatch(organizationDropDownRequest());
      getActivityType();
      dispatch(getProfileUserRequest({ id: userReducer.data.sub }));
      dispatch(getMapKeyRequest());

      // listen unread notification
      socketInstance.listenEventOnce(SocketEvent.Connecting, (event: any) => {
        dispatch(setNotificationUnread(event.total));
      });

      // listen new notification
      socketInstance.listenEvent(SocketEvent.NewNotification, (event) => {
        dispatch(setNotificationUnread(1));
        Toast.show({
          type: 'info',
          text1: event.title || 'New notification',
          text2: event.content || '',
          onPress: () => navigation.navigate(AppRoutes.NOTIFICATION),
        });
      });
      requestPermissionLocation();
    }
  }, [netInfo.isConnected]);

  useEffect(() => {
    if (filterReducer.type.includes('SUCCESS') || filterReducer.type.includes('FAILED')) {
      appContext.setLoading(false);
    }
  }, [filterReducer.type]);

  const getActivityType = () => {
    if (filterReducer.arrTypeActivity.length === 0) {
      dispatch(filterActions.activityTypeRequest());
    }
  };

  const renderModalContent = () => {
    switch (modalType) {
      case 'ModalInfo':
        return (
          <ModalInfo
            mail={userReducer?.data?.email ?? ''}
            onLogout={() => {
              dispatch(logout());
            }}
            onNavigate={(screenName) => {
              navigation.navigate(screenName);
              bottomSheetModalRef.current?.close();
            }}
            title={userReducer?.userInfo?.name ?? ''}
          />
        );
      case 'ModalSelectCategory':
        return (
          <ModalPickerCategory
            title={t('business:chooseKpi')}
            onSelect={(categoryName) => {
              bottomSheetModalRef.current?.close();
            }}
            data={[{ label: t('business:revenue'), key: 'revenue' }]}
          />
        );
      case 'ModalValues':
        return (
          <ModalPickerCategory
            title={t('business:chooseValues')}
            data={[
              {
                label: t('business:values'),
                key: 5,
              },
              {
                label: t('business:quantity'),
                key: 10,
              },
            ]}
            onSelect={(key: number | string) => {
              dispatch(filterActions.setFilterBusiness({ criteriaRank: Number(key) }));
              bottomSheetModalRef.current?.close();
            }}
          />
        );
      case 'ModalFilterByOrganizationUnit':
        return (
          <AppFilterByOrganizationUnit
            listOrganization={filterReducer.organizationList || []}
            arrOrganizationDropDown={filterReducer.arrOrganizationDropDownDashboard}
            idActive={filterReducer.currentOrganization?.id ?? ''}
            onSelect={(item: ItemOrganization, listChildList: ItemOrganization[] | null) => {
              bottomSheetModalRef.current?.close();
              listOrganizationChild.current = listChildList;
              dispatch(setOrganizationFilter(item));
            }}
            height={ScreenHeight - mainLayout.height}
            title={t('title:select_organization')}
            listOrganizationChild={listOrganizationChild.current}
          />
        );
    }
  };
  let showTime = '-';
  if (currentTabIndex === 0) {
    showTime = dayjs(filterReducer.filterBusiness.startDate).isSame(filterReducer.filterBusiness.endDate, 'date')
      ? dayjs(filterReducer.filterBusiness.startDate).format(DATE_FORMAT).toString()
      : `${
          filterReducer.filterBusiness?.startDate
            ? dayjs(filterReducer.filterBusiness.startDate).format(DATE_FORMAT).toString()
            : ''
        } - ${
          filterReducer.filterBusiness?.endDate
            ? dayjs(filterReducer.filterBusiness.endDate).format(DATE_FORMAT).toString()
            : ''
        }`;
  } else {
    showTime = dayjs(filterReducer.filterActivity.startTime).isSame(filterReducer.filterActivity.endTime, 'date')
      ? dayjs(filterReducer.filterActivity.startTime).format(DATE_FORMAT).toString()
      : `${
          filterReducer.filterActivity?.startTime
            ? dayjs(filterReducer.filterActivity.startTime).format(DATE_FORMAT).toString()
            : ''
        } - ${
          filterReducer.filterActivity?.endTime
            ? dayjs(filterReducer.filterActivity.endTime).format(DATE_FORMAT).toString()
            : ''
        }`;
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle={isFocused ? 'light-content' : 'dark-content'} />
      <DashboardHeader
        unreadCount={notiReducer.notificationCount}
        onPressAvatar={() => openModal('ModalInfo')}
        onPressIconNotification={() => {
          navigation.navigate(AppRoutes.NOTIFICATION);
        }}
        onPressButtonLeft={() => {
          navigation.navigate(AppRoutes.DATETIME, { index: currentTabIndex });
        }}
        onPressButtonRight={() =>
          currentTabIndex === 0
            ? openModal('ModalFilterByOrganizationUnit')
            : navigation.navigate(AppRoutes.SEARCH_USER_BY_ORGANIZATION)
        }
        textLeftSelected={showTime}
        textRightSelected={
          currentTabIndex === 0
            ? filterReducer.currentOrganization?.label ?? ''
            : filterReducer.filterUser?.userName ?? filterReducer.organizationActivity?.label ?? ''
        }
        containerStyle={{ paddingTop: Math.min(insets.top, padding.p16) }}
        onLayout={onGetLayout}
        currentTabIndex={currentTabIndex}
        onChangeTab={onChangeTab}
        userName={userReducer?.userInfo?.name ?? ''}
      />
      <View style={contentStyle}>
        <Host>
          <TabView animationConfig={{ useNativeDriver: true }} value={currentTabIndex}>
            <TabView.Item
              // @ts-ignore
              onMoveShouldSetResponder={(e: GestureResponderEvent) => e.stopPropagation()}>
              <BusinessTab
                handleShowModalValues={() => openModal('ModalValues')}
                onSelectCategory={() => openModal('ModalSelectCategory')}
                swiperHeight={swiperHeight}
              />
            </TabView.Item>

            <TabView.Item
              // @ts-ignore
              onMoveShouldSetResponder={(e: GestureResponderEvent) => e.stopPropagation()}>
              <ActivityTab isFocused={currentTabIndex === 1 && isFocused} swiperHeight={swiperHeight} />
            </TabView.Item>
          </TabView>
        </Host>
      </View>

      <Modalize
        adjustToContentHeight
        scrollViewProps={{ keyboardShouldPersistTaps: 'handled' }}
        HeaderComponent={
          modalType === 'ModalInfo' ? () => renderModalHeader(userReducer.userInfo?.name ?? ' ') : undefined
        }
        withHandle={false}
        onClose={closeModal}
        ref={bottomSheetModalRef}>
        {renderModalContent()}
      </Modalize>
    </View>
  );
};

export default DashboardScreen;
