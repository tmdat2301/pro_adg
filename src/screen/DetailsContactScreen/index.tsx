import styles from './styles';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Modal, View, ScrollView, Linking, TouchableOpacity, Alert } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { isIOS, ScreenWidth } from 'react-native-elements/dist/helpers';
import { fontSize, color, padding } from '@helpers/index';
import InfoTab from './tabs/InfoTab';
import InteractiveTab from './tabs/InteractiveTab';
import FileTab from './tabs/FileTab';
import AppointmentTab from './tabs/AppointmentTab';
import MissionTab from './tabs/MissionTab';
import NoteTab from './tabs/NoteTab';
import ActivityTab from './tabs/ActivityTab';
import { AppHeaderInfo, AppSpeedDial, SpeedDialAction, AppText, AppConfirm } from '@components/index';
import { useTranslation } from 'react-i18next';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@redux/reducers';
import {
  detailsContactInfoRequest,
  setRefreshingContactActivity,
  setRefreshingContactAppointment,
  setRefreshingContactFile,
  setRefreshingContactInteractive,
  setRefreshingContactMission,
  setRefreshingContactNote,
  setRefreshingContactInfo,
  setEmptyContact,
  setRefreshingContactDeal,
} from '@redux/actions/detailsActions';
import { getListContactRequest, setContactId } from '@redux/actions/contactAction';
import { MyIcon } from '@components/Icon';
import { NavigationDetails } from '@interfaces/params.interface';
import { Modalize } from 'react-native-modalize';
import { Input } from 'react-native-elements/dist/input/Input';
import NoteScreen from '@screen/NoteScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TypeCriteria, TypeFieldExtension } from '@helpers/constants';
import DealTab from './tabs/DealTab';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppRoutes } from '@navigation/appRoutes';
import { isArray } from 'lodash';
import { Host, Portal } from 'react-native-portalize';
import { ItemIconById } from '@components/Item/Details';
import { AppContext } from '@contexts/index';
import serviceUrls from '@services/serviceUrls';
import { apiDelete } from '@services/serviceHandle';
import { ResponseReturn } from '@interfaces/response.interface';
import Toast from 'react-native-toast-message';
import { ContactMobiles } from '@interfaces/contact.interface';
import { MyInput } from '@components/Input';
import { screenHeight } from 'react-native-calendars/src/expandableCalendar/commons';
import { setTimeOut } from '@helpers/untils';

interface ItemModalOptions {
  id: -1 | -99 | 50 | 1;
  name: string;
  actions: () => void;
}

interface IDetailsContact extends NavigationDetails { }

const DetailsContactScreen = (props: IDetailsContact) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const bottomSheetModalRef = useRef<Modalize>();
  const { objInfo, contactId } = useSelector((state: RootState) => state.detailsContactReducer);
  const navigation = useNavigation();
  const [index, setIndexCrnt] = useState(props.route.params.page || 0);
  const [openSpeedDial, setOpenSpeedDial] = useState(false);
  const [openModalNote, setOpenModalNote] = useState(false);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [modalType, setModalType] = useState<'demand' | 'options' | 'corpor'>('demand');
  const [textFilter, setTextFilter] = useState('');
  const appContext = useContext(AppContext);
  const contactReducer = useSelector((state: RootState) => state.contactReducers);
  const openModal = (type: 'demand' | 'options' | 'corpor') => {
    setModalType(type);
    bottomSheetModalRef.current?.open();
  };
  useEffect(() => {
    dispatch(setContactId(props.route.params.key));
    dispatch(detailsContactInfoRequest(props.route.params.key, true));
    return () => {
      dispatch(setRefreshingContactActivity(true));
      dispatch(setRefreshingContactAppointment(true));
      dispatch(setRefreshingContactFile(true));
      dispatch(setRefreshingContactInteractive(true));
      dispatch(setRefreshingContactMission(true));
      dispatch(setRefreshingContactNote(true));
      dispatch(setRefreshingContactInfo(true));
      dispatch(setRefreshingContactDeal(true));
      dispatch(setEmptyContact());
    };
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      dispatch(setRefreshingContactDeal(true));
      dispatch(setRefreshingContactActivity(true));
      return () => { };
    }, []),
  );
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
        labelStyle={{ fontSize: fontSize.f13 }}
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
        dispatch(setRefreshingContactActivity(true));
      }
      if (indexSet === index) {
        return;
      }
      setIndexCrnt(indexSet);
    } catch (error) { }
  };

  const arrOptions: ItemModalOptions[] = [
    {
      id: 1,
      name: t('button:update_contact'),
      actions: () => {
        bottomSheetModalRef.current?.close();
        if (objInfo) {
          navigation.navigate(AppRoutes.CREATE_AND_EDIT_LCCD, {
            type: TypeFieldExtension.contact,
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
              contacts: [{ label: objInfo.id, value: objInfo.fullName, email: null }],
              comporateId: objInfo.accounts?.find((el) => el.checked)?.corporateId,
              comporateName: objInfo.accounts?.find((el) => el.checked)?.name,
            },
            isGoback: true,
          });
        }
      },
    },
    {
      id: -99,
      name: t('lead:delete_contact'),
      actions: () => {
        bottomSheetModalRef.current?.close();
        setOpenModalConfirm(true);
      },
    },
  ];

  const viewModal = () => {
    switch (modalType) {
      case 'demand':
        return (
          <>
            {objInfo &&
              objInfo.accounts &&
              objInfo.accounts.length > 0 &&
              objInfo.accounts
                .filter(
                  (x) => x.name && x.name.trim().toLocaleLowerCase().includes(textFilter.trim().toLocaleLowerCase()),
                )
                .map((v, i) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        navigation.navigate(AppRoutes.DETAIL_CORPORATE, { key: v.corporateId, isGoback: true });
                      }}
                      key={v.id}
                      style={styles.touchItemSheet}>
                      <AppText value={v.name} fontSize={fontSize.f14} style={styles.textItemSheet} />
                      <View style={styles.lineItemSepe} />
                    </TouchableOpacity>
                  );
                })}
          </>
        );
      case 'corpor':
        return (
          <>
            {objInfo &&
              objInfo.accounts &&
              objInfo.accounts.length > 0 &&
              objInfo.accounts
                .filter(
                  (x) => x.name && x.name.trim().toLocaleLowerCase().includes(textFilter.trim().toLocaleLowerCase()),
                )
                .map((v, i) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        if (v.corporateId) {
                          bottomSheetModalRef.current?.close();
                          navigation.navigate(AppRoutes.DETAIL_CORPORATE, { key: v.corporateId, isGoback: true });
                        }
                      }}
                      key={v.corporateId}
                      style={styles.touchItemSheet}>
                      <AppText
                        value={v.name ?? ''}
                        fontSize={fontSize.f14}
                        style={styles.textItemSheet}
                        color={v.corporateId ? color.navyBlue : color.black}
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
      case 'demand':
        return t('lead:demand');
      case 'corpor':
        return t('title:interprise');
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
        deleteContact();
      }, setTimeOut());
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('lead:notice'),
        text2: JSON.stringify(error),
      });
    }
  };

  const deleteContact = async () => {
    try {
      if (objInfo) {
        appContext.setLoading(true);
        const url = `${serviceUrls.path.getListContact}?contactId=${objInfo.id}`;
        const response: ResponseReturn<any> = await apiDelete(url, {});
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
            text1: t('lead:notice'),
            text2: t('lead:delete_success'),
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

  let company: string | null = null;
  if (objInfo && objInfo.accounts && objInfo.accounts.length >= 1) {
    if (objInfo.accounts.length === 1) {
      company = objInfo.accounts[0].name ?? '';
    } else {
      company = `${objInfo.accounts[0].name ?? ''} + ${objInfo.accounts.length - 1}`;
    }
  }
  const isRolePress = objInfo && objInfo.accounts && objInfo.accounts.length > 0 ? true : false;
  const getListPhone = (phones?: ContactMobiles[], name?: string) => {
    if (isArray(phones)) {
      const listPhones = phones?.map((elm) => ({
        title: elm.phoneNumber,
        icon: <MyIcon.CallModal />,
        function: () => {
          const phone = `${elm.code}${elm.phoneNumber}`;
          const phoneShow = `(+${elm.code})${elm.phoneNumber}`;
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

  const refreshTab = () => {
    switch (index) {
      case 5: {
        dispatch(setRefreshingContactMission(true));
        break;
      }
      case 6: {
        dispatch(setRefreshingContactAppointment(true));
        break;
      }
      default: {
        break;
      }
    }
  };

  return (
    <Host>
      <View style={styles.container}>
        <AppHeaderInfo
          name={objInfo ? objInfo.fullName : 'N/A'}
          role={company}
          onRightPress={() => openModal('options')}
          onLeftPress={() => {
            dispatch(
              getListContactRequest({
                maxResultCount: 10,
                skipCount: 1,
                organizationUnitId: contactReducer.filter.OrganizationUnitId,
                filterType: contactReducer.filter.filterType,
                filter: contactReducer.filter.filter,
              }),
            );
            if (props.route.params.isGoback) {
              navigation.goBack();
            } else {
              navigation.popToTop();
            }
          }}
          isRolePress={isRolePress}
          onPressWhenManyValues={() => {
            if (objInfo && isArray(objInfo.accounts) && objInfo.accounts.length > 0) {
              if (objInfo.accounts.length > 1) {
                openModal('corpor');
              } else {
                navigation.navigate(AppRoutes.DETAIL_CORPORATE, {
                  key: objInfo.accounts[0].corporateId,
                  isGoback: true,
                });
              }
            }
          }}
          onMailActions={() => {
            const email = objInfo?.emails?.find((elm) => elm.checked)?.value ?? 'support@example.com';
            objInfo?.emails && isArray(objInfo?.emails) && objInfo?.emails.length > 0
              ? Linking.openURL(`mailto:${email}`)
              : Linking.openURL('mailto:');
          }}
          onEditActions={() => {
            if (objInfo) {
              navigation.navigate(AppRoutes.CREATE_AND_EDIT_LCCD, {
                type: TypeFieldExtension.contact,
                idUpdate: objInfo.id,
              });
            }
          }}
          listPhone={getListPhone(objInfo?.mobiles, objInfo?.fullName)}
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
                id: objInfo ? objInfo.id : '',
                name: objInfo ? objInfo.fullName : '',
                menuId: TypeCriteria.contact,
                onRefreshing: () => {
                  refreshTab();
                },
                typeTab: TypeFieldExtension.contact,
              });
            }}
          />
          <SpeedDialAction
            icon={<MyIcon.Calendar />}
            title={t('button:add_appointment')}
            onPress={() => {
              setOpenSpeedDial(false);
              navigation.navigate(AppRoutes.CREATE_AND_EDIT_APPOINTMENT, {
                id: objInfo ? objInfo.id : '',
                name: objInfo ? objInfo.fullName : '',
                menuId: TypeCriteria.contact,
                onRefreshing: () => {
                  refreshTab();
                },
                typeTab: TypeFieldExtension.contact,
              });
            }}
          />
          <SpeedDialAction
            icon={<MyIcon.Phone />}
            onPress={() => {
              if (objInfo && objInfo.mobiles && objInfo.mobiles.length > 0) {
                const indexMain = objInfo.mobiles.findIndex((x) => x.isMain);
                if (indexMain > -1) {
                  const phone = `${objInfo.mobiles[indexMain].code}${objInfo.mobiles[indexMain].phoneNumber}`;
                  const phoneShow = `(+${objInfo.mobiles[indexMain].code})${objInfo.mobiles[indexMain].phoneNumber}`;
                  navigation.navigate(AppRoutes.CALL, {
                    name: objInfo.fullName,
                    phone: phone,
                    phoneShow: phoneShow,
                  });
                } else {
                  const phone = `${objInfo.mobiles[0].code}${objInfo.mobiles[0].phoneNumber}`;
                  const phoneShow = `(+${objInfo.mobiles[0].code})${objInfo.mobiles[0].phoneNumber}`;
                  navigation.navigate(AppRoutes.CALL, {
                    name: objInfo.fullName,
                    phone: phone,
                    phoneShow: phoneShow,
                  });
                }
              } else {
                Toast.show({
                  type: 'error',
                  text1: t('lead:notice'),
                  text2: t('lead:contact_no_phone'),
                });
              }
            }}
            title={t('button:call')}
          />
          <SpeedDialAction
            icon={<Icon type="antdesign" name="mail" color={color.white} size={fontSize.f14} />}
            title={t('button:email')}
            onPress={() => {
              const email = objInfo?.emails?.find((elm) => elm.checked)?.value ?? 'support@example.com';
              objInfo?.emails && isArray(objInfo?.emails) && objInfo?.emails.length > 0
                ? Linking.openURL(`mailto:${email}`)
                : Linking.openURL('mailto:');
            }}
          />
        </AppSpeedDial>

        <Modal visible={openModalNote} transparent animationType="fade">
          <NoteScreen
            typeView={'create'}
            onPressOne={() => setOpenModalNote(false)}
            onPressExtra={() => {
              setOpenModalNote(false);
              dispatch(setRefreshingContactNote(true));
            }}
            idCrnt={contactId || -99}
            itemNote={null}
            typeAPI="contact"
          />
        </Modal>

        <Modal visible={openModalConfirm} transparent animationType="fade">
          <AppConfirm
            title={t('lead:delete_contact')}
            content={`${t('lead:confirm_quest_delete')}`}
            subContent={`${objInfo && objInfo.fullName ? objInfo.fullName : ''}?`}
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

export default DetailsContactScreen;
