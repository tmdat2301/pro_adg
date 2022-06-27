import styles from './styles';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Modal, View, ScrollView, Linking, TouchableOpacity, Alert } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { isIOS, ScreenWidth } from 'react-native-elements/dist/helpers';
import { AppText, AppConfirm } from '@components/index';
import { fontSize, color, responsivePixel, padding } from '@helpers/index';
import InfoTab from './tabs/InfoTab';
import InteractiveTab from './tabs/InteractiveTab';
import FileTab from './tabs/FileTab';
import AppointmentTab from './tabs/AppointmentTab';
import MissionTab from './tabs/MissionTab';
import NoteTab from './tabs/NoteTab';
import ActivityTab from './tabs/ActivityTab';
import AppHeaderInfo from '@components/AppHeaderInfo';
import { useTranslation } from 'react-i18next';
import AppSpeedDial from '@components/AppSpeedDial';
import SpeedDialAction from '@components/SpeedDialAction';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@redux/reducers';
import {
  detailsCorporateInfoRequest,
  setRefreshingCorporateActivity,
  setRefreshingCorporateAppointment,
  setRefreshingCorporateFile,
  setRefreshingCorporateInteractive,
  setRefreshingCorporateMission,
  setRefreshingCorporateNote,
  setRefreshingCorporateInfo,
  setRefreshingCorporateDeal,
  setEmptyCorporate,
} from '@redux/actions/detailsActions';
import { getListInterpriseRequest, setCorporateId } from '@redux/actions/interpriseActions';
import { MyIcon } from '@components/Icon';
import { NavigationDetails } from '@interfaces/params.interface';
import { Modalize } from 'react-native-modalize';
import { Input } from 'react-native-elements/dist/input/Input';
import NoteScreen from '@screen/NoteScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TypeCriteria, TypeFieldExtension } from '@helpers/constants';
import DealTab from './tabs/DealTab';
import { AppRoutes } from '@navigation/appRoutes';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Host, Portal } from 'react-native-portalize';
import { AppContext } from '@contexts/index';
import { ItemIconById } from '@components/Item/Details';
import serviceUrls from '@services/serviceUrls';
import { apiDelete } from '@services/serviceHandle';
import { ResponseReturn } from '@interfaces/response.interface';
import Toast from 'react-native-toast-message';
import { LeadMobileItem } from '@interfaces/contact.interface';
import { isArray } from 'lodash';
import { ItemAppMenuProps } from '@components/AppMenu';
import { screenHeight } from 'react-native-calendars/src/expandableCalendar/commons';
import { MyInput } from '@components/Input';
import { setTimeOut } from '@helpers/untils';

interface ItemModalOptions {
  id: -1 | -99 | 50 | 1;
  name: string;
  actions: () => void;
}

interface IDetailsCorporate extends NavigationDetails {}

const DetailsCorporateScreen = (props: IDetailsCorporate) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const bottomSheetModalRef = useRef<Modalize>();
  const { objInfo, corporateId } = useSelector((state: RootState) => state.detailsCorporateReducer);
  const [index, setIndexCrnt] = useState(props.route.params.page || 0);
  const [openSpeedDial, setOpenSpeedDial] = useState(false);
  const [openModalNote, setOpenModalNote] = useState(false);
  const interpriseReducer = useSelector((state: RootState) => state.interpriseReducers);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [modalType, setModalType] = useState<'options' | 'contacts'>('options');
  const [textFilter, setTextFilter] = useState('');
  const appContext = useContext(AppContext);
  const openModal = (type: 'options' | 'contacts') => {
    setModalType(type);
    bottomSheetModalRef.current?.open();
  };
  useEffect(() => {
    dispatch(setCorporateId(props.route.params.key));
    dispatch(detailsCorporateInfoRequest(props.route.params.key, true));
    return () => {
      dispatch(setRefreshingCorporateActivity(true));
      dispatch(setRefreshingCorporateAppointment(true));
      dispatch(setRefreshingCorporateFile(true));
      dispatch(setRefreshingCorporateInteractive(true));
      dispatch(setRefreshingCorporateMission(true));
      dispatch(setRefreshingCorporateNote(true));
      dispatch(setRefreshingCorporateInfo(true));
      dispatch(setRefreshingCorporateDeal(true));
      dispatch(setEmptyCorporate());
    };
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      dispatch(setRefreshingCorporateActivity(true));
      dispatch(setRefreshingCorporateDeal(true));
      return () => {};
    }, []),
  );
  const navigation = useNavigation();
  const [routes] = React.useState([
    { key: 'info', title: t('title:info') },
    { key: 'deal', title: t('title:deal') },
    { key: 'interactive', title: t('title:interactive') },
    { key: 'activity', title: t('title:activity') },
    { key: 'note', title: t('title:note') },
    { key: 'mission', title: t('title:mission') },
    { key: 'appointment', title: t('title:appointment') },
    { key: 'file', title: t('title:file') },
  ]);
  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case 'info': {
        return <InfoTab />;
      }
      case 'deal': {
        return <DealTab />;
      }
      case 'interactive': {
        return <InteractiveTab />;
      }
      case 'activity': {
        return <ActivityTab />;
      }
      case 'note': {
        return <NoteTab />;
      }
      case 'mission': {
        return <MissionTab />;
      }
      case 'appointment': {
        return <AppointmentTab />;
      }
      case 'file': {
        return <FileTab />;
      }
      default: {
        return <InfoTab />;
      }
    }
  };

  const refreshTab = () => {
    switch (index) {
      case 5: {
        dispatch(setRefreshingCorporateMission(true));
        break;
      }
      case 6: {
        dispatch(setRefreshingCorporateAppointment(true));
        break;
      }
      default: {
        break;
      }
    }
  };

  const renderTabBar = (props: any) => {
    return (
      <TabBar
        {...props}
        scrollEnabled={true}
        activeColor={color.navyBlue}
        inactiveColor={color.subText}
        pressOpacity={0}
        pressColor={color.white}
        style={styles.whiteScreen}
        indicatorStyle={styles.blueScreen}
        labelStyle={{ fontSize: fontSize.f14 }}
        tabStyle={{ width: 'auto' }}
        renderLabel={(sc) => {
          return (
            <AppText
              value={sc.route.title}
              color={getColor(sc.route.key)}
              style={{ width: '100%' }}
              numberOfLines={1}
            />
          );
        }}
      />
    );
  };

  const getColor = (key: string) => {
    try {
      const indexFound = routes.findIndex((x) => x.key === key);
      if (indexFound > -1) {
        if (indexFound === index) {
          return color.navyBlue;
        }
      } else {
        return color.subText;
      }
    } catch (error) {
      return color.subText;
    }
  };
  const setIndex = (indexSet: number) => {
    try {
      if (indexSet === 3) {
        dispatch(setRefreshingCorporateActivity(true));
      }
      if (indexSet === index) {
        return;
      }
      setIndexCrnt(indexSet);
    } catch (error) {}
  };

  const arrOptions: ItemModalOptions[] = [
    {
      id: 1,
      name: t('button:update_enterprise'),
      actions: () => {
        bottomSheetModalRef.current?.close();
        if (objInfo) {
          navigation.navigate(AppRoutes.CREATE_AND_EDIT_LCCD, {
            type: TypeFieldExtension.corporate,
            idUpdate: objInfo.id,
          });
        }
      },
    },
    {
      id: -1,
      name: t('button:add_deal'),
      actions: () => {
        bottomSheetModalRef.current?.close();
        if (objInfo) {
          navigation.navigate(AppRoutes.CREATE_AND_EDIT_LCCD, {
            type: TypeFieldExtension.deal,
            objInfo: {
              contacts: objInfo.contacts.map((el) => {
                return { label: el.id, value: el.fullName, email: null };
              }),
              comporateId: objInfo.id,
              comporateName: objInfo.brandName,
            },
            isGoback: true,
          });
        }
      },
    },
    {
      id: -99,
      name: t('lead:delete_corporate'),
      actions: () => {
        bottomSheetModalRef.current?.close();
        setOpenModalConfirm(true);
      },
    },
  ];

  const viewModal = () => {
    switch (modalType) {
      case 'contacts':
        return (
          <>
            {objInfo &&
              objInfo.contacts &&
              objInfo.contacts.length > 0 &&
              objInfo.contacts
                .filter((x) => x.fullName.trim().toLocaleLowerCase().includes(textFilter.trim().toLocaleLowerCase()))
                .map((v, i) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        bottomSheetModalRef.current?.close();
                        navigation.navigate(AppRoutes.DETAIL_CONTACT, { key: v.id, isGoback: true });
                      }}
                      key={v.id}
                      style={styles.touchItemSheet}>
                      <AppText
                        value={v.fullName}
                        fontSize={fontSize.f14}
                        style={styles.textItemSheet}
                        color={color.navyBlue}
                      />
                      <View style={styles.lineItemSepe} />
                    </TouchableOpacity>
                  );
                })}
          </>
        );
      case 'options':
        return (
          <>
            {arrOptions.map((v, i) => {
              return (
                <>
                  <TouchableOpacity
                    key={v.id}
                    onPress={() => {
                      v.actions();
                    }}
                    activeOpacity={0.8}
                    style={styles.touchItemSheet2}>
                    <ItemIconById id={v.id} />
                    <AppText
                      value={v.name}
                      fontSize={fontSize.f14}
                      color={v.id === -99 ? color.red : color.black}
                      style={styles.textItemSheet2}
                    />
                  </TouchableOpacity>
                  <View style={styles.lineItemSepe} />
                </>
              );
            })}
          </>
        );
    }
  };

  const titleModalize = () => {
    switch (modalType) {
      case 'contacts':
        return t('title:contact');
      case 'options':
        return t('lead:select_options');
      default:
        return '';
    }
  };

  const onOptions = () => {
    try {
      setOpenModalConfirm(false);
      setTimeout(() => {
        deleteCorporate();
      }, setTimeOut());
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('lead:notice'),
        text2: JSON.stringify(error),
      });
    }
  };

  const deleteCorporate = async () => {
    try {
      if (objInfo) {
        appContext.setLoading(true);
        const url = `${serviceUrls.path.getListInterprise}?recordId=${objInfo.id}`;
        const response: ResponseReturn<boolean> = await apiDelete(url, {});
        if (response.code && response.code === 403) {
          Alert.alert(t('error:no_access'), t('error:no_access_content'), [
            {
              text: t('error:understand'),
              style: 'cancel',
            },
          ]);
          return;
        }
        if (response.error) {
          appContext.setLoading(false);
          Toast.show({
            type: 'error',
            text1: t('lead:notice'),
            text2: response.errorMessage || response.detail || '',
          });
          return;
        }
        if (response.code && response.code === 403) {
          Toast.show({
            type: 'error',
            text1: t('lead:notice'),
            text2: t('lead:no_permisssion'),
          });
          return;
        }
        if (response.response && response.response.data) {
          Toast.show({
            type: 'success',
            text1: t('lead:delete_success'),
          });
          navigation.goBack();
        }
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('lead:notice'),
        text2: JSON.stringify(error),
      });
    } finally {
      appContext.setLoading(false);
    }
  };

  let contact: string | null = null;
  if (objInfo && objInfo.contacts && objInfo.contacts.length >= 1) {
    if (objInfo.contacts.length === 1) {
      contact = objInfo.contacts[0].fullName ?? '';
    } else {
      contact = `${objInfo.contacts[0].fullName ?? ''} + ${objInfo.contacts.length - 1}`;
    }
  }
  const isRolePress = objInfo && objInfo.contacts && objInfo.contacts.length > 0 ? true : false;

  const getListPhone = (phones?: LeadMobileItem[], name?: string) => {
    if (isArray(phones)) {
      const listPhones = phones?.map((elm) => ({
        title: elm.phoneNumber,
        icon: <MyIcon.CallModal />,
        function: () => {
          const phone = `${elm.countryCode}${elm.phoneNational}`;
          const phoneShow = elm.phoneNumber;
          navigation.navigate(AppRoutes.CALL, {
            name: name,
            phone: phone,
            phoneShow: phoneShow,
          });
        },
      }));
      return listPhones;
    }
    return [];
  };
  return (
    <Host>
      <View style={styles.container}>
        <AppHeaderInfo
          name={objInfo && objInfo.brandName ? objInfo.brandName : 'N/A'}
          onRightPress={() => {
            openModal('options');
          }}
          onLeftPress={() => {
            dispatch(
              getListInterpriseRequest({
                maxResultCount: 10,
                skipCount: 1,
                organizationUnitId: interpriseReducer.filter.OrganizationUnitId,
                filterType: interpriseReducer.filter.filterType,
                filter: interpriseReducer.filter.filter,
              }),
            );
            if (props.route.params.isGoback) {
              navigation.goBack();
            } else {
              navigation.popToTop();
            }
          }}
          role={contact}
          isRolePress={isRolePress}
          onPressWhenManyValues={() => {
            if (objInfo && isArray(objInfo.contacts) && objInfo.contacts.length > 0) {
              if (objInfo.contacts.length > 1) {
                openModal('contacts');
              } else {
                navigation.navigate(AppRoutes.DETAIL_CONTACT, { key: objInfo.contacts[0].id, isGoback: true });
              }
            }
          }}
          onMailActions={() => {
            Linking.openURL('mailto:');
          }}
          onEditActions={() => {
            if (objInfo) {
              navigation.navigate(AppRoutes.CREATE_AND_EDIT_LCCD, {
                type: TypeFieldExtension.corporate,
                idUpdate: objInfo.id,
              });
            }
          }}
          listPhone={getListPhone(objInfo?.mobiles, objInfo?.brandName) as ItemAppMenuProps[]}
        />
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={(index) => {
            setIndex(index);
          }}
          initialLayout={{ width: ScreenWidth }}
          showPageIndicator
          swipeEnabled
          lazy={true}
          renderTabBar={renderTabBar}
          style={styles.whiteScreen}
        />
        <AppSpeedDial
          style={{ paddingBottom: padding.p48 }}
          delayPressIn={0}
          isOpen={openSpeedDial}
          onClose={() => setOpenSpeedDial(!openSpeedDial)}
          onOpen={() => setOpenSpeedDial(!openSpeedDial)}>
          <SpeedDialAction
            icon={<Icon type="feather" name="file-text" color={color.white} size={fontSize.f14} />}
            title={t('button:add_note')}
            onPress={() => {
              setOpenSpeedDial(false);
              setOpenModalNote(true);
            }}
          />
          <SpeedDialAction
            icon={<MyIcon.CarryOut />}
            title={t('button:add_task')}
            onPress={() => {
              setOpenSpeedDial(false);
              navigation.navigate(AppRoutes.CREATE_AND_EDIT_TASK, {
                id: objInfo ? objInfo?.id : '',
                name: objInfo ? objInfo?.brandName : '',
                menuId: TypeCriteria.corporate,
                onRefreshing: () => {
                  refreshTab();
                },
                typeTab: TypeFieldExtension.corporate,
              });
            }}
          />
          <SpeedDialAction
            icon={<MyIcon.Calendar />}
            title={t('button:add_appointment')}
            onPress={() => {
              setOpenSpeedDial(false);
              navigation.navigate(AppRoutes.CREATE_AND_EDIT_APPOINTMENT, {
                id: objInfo ? objInfo?.id : '',
                name: objInfo ? objInfo?.brandName : '',
                menuId: TypeCriteria.corporate,
                onRefreshing: () => {
                  refreshTab();
                },
                typeTab: TypeFieldExtension.corporate,
              });
            }}
          />
          <SpeedDialAction
            icon={<MyIcon.Phone />}
            onPress={() => {
              if (objInfo && objInfo.mobiles && objInfo.mobiles.length > 0) {
                const indexMain = objInfo.mobiles.findIndex((x) => x.isMain);
                if (indexMain > -1) {
                  const phone = `${objInfo.mobiles[indexMain].countryCode}${objInfo.mobiles[indexMain].phoneNational}`;
                  const phoneShow = objInfo.mobiles[indexMain].phoneNumber;
                  navigation.navigate(AppRoutes.CALL, {
                    name: objInfo.brandName,
                    phone: phone,
                    phoneShow: phoneShow,
                  });
                } else {
                  const phone = `${objInfo.mobiles[0].countryCode}${objInfo.mobiles[0].phoneNational}`;
                  const phoneShow = objInfo.mobiles[0].phoneNumber;
                  navigation.navigate(AppRoutes.CALL, {
                    name: objInfo.brandName,
                    phone: phone,
                    phoneShow: phoneShow,
                  });
                }
              } else {
                Toast.show({
                  type: 'error',
                  text1: t('lead:notice'),
                  text2: t('lead:corporate_no_phone'),
                });
              }
            }}
            title={t('button:call')}
          />
          <SpeedDialAction
            icon={<Icon type="antdesign" name="mail" color={color.white} size={fontSize.f14} />}
            title={t('button:email')}
            onPress={() => {
              Linking.openURL('mailto:');
            }}
          />
        </AppSpeedDial>

        <Modal visible={openModalNote} transparent animationType="fade">
          <NoteScreen
            typeView={'create'}
            onPressOne={() => setOpenModalNote(false)}
            onPressExtra={() => {
              setOpenModalNote(false);
              dispatch(setRefreshingCorporateNote(true));
            }}
            idCrnt={corporateId || -99}
            itemNote={null}
            typeAPI="corpo"
          />
        </Modal>
        <Modal visible={openModalConfirm} transparent animationType="fade">
          <AppConfirm
            title={t('lead:delete_corporate')}
            content={`${t('lead:confirm_quest_delete')}`}
            subContent={`${objInfo && objInfo.brandName ? objInfo.brandName : ''}?`}
            colorSubContent={color.black}
            onPressLeft={() => setOpenModalConfirm(false)}
            onPressRight={() => {
              onOptions();
            }}
          />
        </Modal>
        <Portal>
          <Modalize
            onClosed={() => {
              setTextFilter('');
            }}
            adjustToContentHeight
            ref={bottomSheetModalRef}
            HeaderComponent={() => {
              return (
                <View style={styles.headerBotSheet}>
                  <View style={styles.centerHeader}>
                    <AppText value={titleModalize()} fontSize={fontSize.f16} fontWeight="semibold" />
                  </View>
                </View>
              );
            }}>
            <>
              {modalType === 'options' ? null : (
                <MyInput.Search
                  value={textFilter}
                  placeholder={t('lead:enter_filter_content')}
                  onChangeText={(text) => {
                    setTextFilter(text);
                  }}
                />
              )}
              <ScrollView
                style={{
                  paddingBottom: useSafeAreaInsets().bottom,
                  height: isIOS || modalType === 'options' ? undefined : screenHeight * 0.7,
                }}>
                {viewModal()}
              </ScrollView>
            </>
          </Modalize>
        </Portal>
      </View>
    </Host>
  );
};

export default DetailsCorporateScreen;
