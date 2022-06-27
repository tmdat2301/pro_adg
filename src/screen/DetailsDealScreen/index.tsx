import styles from './styles';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { FlatList, Modal, View, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { isIOS, ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';
import AppText from '@components/AppText';
import { fontSize, color, padding } from '@helpers/index';
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
import { ItemPipeLine, ItemIconById } from '@components/Item/Details/index';
import {
  detailsDealInfoRequest,
  setRefreshingDealActivity,
  setRefreshingDealAppointment,
  setRefreshingDealFile,
  setRefreshingDealInteractive,
  setRefreshingDealMission,
  setRefreshingDealNote,
  setRefreshingDealInfo,
  setEmptyDeal,
} from '@redux/actions/detailsActions';
import { getListDealRequest, setDealId } from '@redux/actions/dealActions';
import { MyIcon } from '@components/Icon';
import { PipeLinesDetails } from '@interfaces/lead.interface';
import { apiDelete, apiGet, apiPut } from '@services/serviceHandle';
import serviceUrls from '@services/serviceUrls';
import { BodyPipeLine, NavigationDetails } from '@interfaces/params.interface';
import { ResponseReturn } from '@interfaces/response.interface';
import { AppContext } from '@contexts/index';
import { Modalize } from 'react-native-modalize';
import NoteScreen from '@screen/NoteScreen';
import AppConfirm from '@components/AppConfirm';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TypeCriteria, TypeFieldExtension } from '@helpers/constants';
import { convertCurrency } from '@helpers/untils';
import { setTimeOut } from '@helpers/untils';
import { AppRoutes } from '@navigation/appRoutes';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ItemVel } from '@interfaces/contact.interface';
import Toast from 'react-native-toast-message';
import { Host, Portal } from 'react-native-portalize';
import { DataContactByDeal } from '@interfaces/deal.interface';
import { isArray } from 'lodash';
import { ItemAppMenuProps } from '@components/AppMenu';
import { MyInput } from '@components/Input';
interface ItemModalOptions {
  id: -1 | -99 | 50 | 1;
  name: string;
  actions: () => void;
}

interface IDetailsDeal extends NavigationDetails { }

const DetailsDealScreen = (props: IDetailsDeal) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const appContext = useContext(AppContext);
  const bottomSheetModalRef = useRef<Modalize>();
  const { objInfo, dealId } = useSelector((state: RootState) => state.detailsDealReducer);
  const [index, setIndexCrnt] = useState(props.route.params.page || 0);
  const dealReducer = useSelector((state: RootState) => state.dealReducers);
  const [objectSelectedPipeline, setObjectSelectedPipeline] = useState<PipeLinesDetails>({
    id: -99,
    pipeline1: '',
    sort: -99,
    pipelineSymbol: '',
    pipelinePositionId: -99,
  });
  const [arrFailureReason, setFailureReasons] = useState<ItemVel[]>([]);
  const [modalType, setModalType] = useState<'fail' | 'pipe' | 'contact' | 'options'>('pipe');
  const openModal = (type: 'contact' | 'pipe' | 'fail' | 'options') => {
    setModalType(type);
    bottomSheetModalRef.current?.open();
  };
  const [openSpeedDial, setOpenSpeedDial] = useState(false);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [openModalNote, setOpenModalNote] = useState(false);
  const [textFilter, setTextFilter] = useState('');
  const [listPhone, setListPhone] = useState<ItemAppMenuProps[]>([]);

  useEffect(() => {
    const getContactByDeal = async () => {
      try {
        const url = serviceUrls.path.getContactByDeal(props.route.params.key || '');
        const response: ResponseReturn<DataContactByDeal[]> = await apiGet(url, {});
        if (isArray(response.response?.data)) {
          const phones = response.response?.data[0]?.mobiles?.map((elm) => ({
            title: elm.phoneNumber,
            icon: <MyIcon.CallModal />,
            function: () => {
              const phone = `${elm.countryCode}${elm.phoneNational}`;
              const phoneShow = elm.phoneNumber;
              navigation.navigate(AppRoutes.CALL, {
                name: response.response?.data[0].name || '',
                phone: phone,
                phoneShow: phoneShow,
              });
            },
          }));
          if (phones) {
            setListPhone(phones);
          }
        }
      } catch (error) { }
    };
    getContactByDeal();
    getFailureReasons();
    dispatch(setDealId(props.route.params.key));
    dispatch(detailsDealInfoRequest(props.route.params.key, true));
    return () => {
      dispatch(setRefreshingDealActivity(true));
      dispatch(setRefreshingDealAppointment(true));
      dispatch(setRefreshingDealFile(true));
      dispatch(setRefreshingDealInteractive(true));
      dispatch(setRefreshingDealMission(true));
      dispatch(setRefreshingDealNote(true));
      dispatch(setRefreshingDealInfo(true));
      dispatch(setEmptyDeal());
    };
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      dispatch(setRefreshingDealActivity(true));
      return () => { };
    }, []),
  );
  const [routes] = React.useState([
    { key: 'info', title: t('title:info') },
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
      case 4: {
        dispatch(setRefreshingDealMission(true));
        break;
      }
      case 5: {
        dispatch(setRefreshingDealAppointment(true));
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
      if (indexSet === 2) {
        dispatch(setRefreshingDealActivity(true));
      }
      if (indexSet === index) {
        return;
      }
      setIndexCrnt(indexSet);
    } catch (error) { }
  };

  ///api
  const getFailureReasons = async () => {
    try {
      const response: ResponseReturn<ItemVel[]> = await apiGet(
        `${serviceUrls.path.failureReason}${TypeCriteria.deal}`,
        {},
      );
      if (response.error) {
        Toast.show({
          type: 'error',
          text1: t('lead:notice'),
          text2: response.errorMessage || response.detail || '',
        });
        return;
      }
      if (response.response && response.response.data) {
        setFailureReasons(response.response.data);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('lead:notice'),
        text2: JSON.stringify(error),
      });
    }
  };
  const changePipeLine = async (body: BodyPipeLine) => {
    try {
      if (objectSelectedPipeline.id > -1 && objectSelectedPipeline.sort > -1) {
        appContext.setLoading(true);
        const response: ResponseReturn<boolean> = await apiPut(serviceUrls.path.changeStatusDealPipeLine, body);
        appContext.setLoading(false);
        if (response.error) {
          Toast.show({ type: 'error', text1: t('lead:notice'), text2: response.errorMessage });
          return;
        }
        if (response.response && response.response.data) {
          dispatch(detailsDealInfoRequest(dealId ? dealId : props.route.params.key, true));
          if (index === 2) {
            dispatch(setRefreshingDealActivity(true));
          }
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

  const arrOptions: ItemModalOptions[] = [
    {
      id: 1,
      name: t('button:update_deal'),
      actions: () => {
        bottomSheetModalRef.current?.close();
        if (objInfo) {
          navigation.navigate(AppRoutes.CREATE_AND_EDIT_LCCD, { type: TypeFieldExtension.deal, idUpdate: objInfo.id });
        }
      },
    },
    {
      id: -99,
      name: t('lead:delete_deal'),
      actions: () => {
        bottomSheetModalRef.current?.close();
        setOpenModalConfirm(true);
      },
    },
  ];

  const viewModal = () => {
    switch (modalType) {
      case 'fail':
        return (
          <>
            {arrFailureReason
              .filter((x) => x.value.toLocaleLowerCase().includes(textFilter.trim().toLocaleLowerCase()) === true)
              .map((v, i) => {
                return (
                  <TouchableOpacity
                    key={v.label}
                    onPress={() => {
                      // setSelectedFailureReason(v);
                      bottomSheetModalRef.current?.close();
                      setTimeout(() => {
                        changePipeLine({
                          dealId: props.route.params.key,
                          pipelineId: objectSelectedPipeline.id,
                          failureReasonId: v.label,
                          note: v.value,
                        });
                      }, setTimeOut());
                    }}
                    activeOpacity={0.8}
                    style={styles.touchItemSheet}>
                    <AppText value={v.value} fontSize={fontSize.f14} style={styles.textItemSheet} />
                    <View style={styles.lineItemSepe} />
                  </TouchableOpacity>
                );
              })}
          </>
        );
      case 'pipe':
        return (
          <>
            {objInfo &&
              objInfo.pipelines
                .filter((x) => x.pipelinePositionId === 4 || x.pipelinePositionId === 3)
                .map((v, i) => {
                  return (
                    <TouchableOpacity
                      key={v.id}
                      onPress={() => {
                        bottomSheetModalRef.current?.close();
                        setObjectSelectedPipeline(v);
                        setTimeout(() => {
                          setOpenModalConfirm(true);
                        }, setTimeOut());
                      }}
                      activeOpacity={0.8}
                      style={styles.touchItemSheet}>
                      <AppText
                        value={v.pipelineSymbol + ' - ' + v.pipeline1}
                        fontSize={fontSize.f14}
                        style={styles.textItemSheet}
                      />
                      <View style={styles.lineItemSepe} />
                    </TouchableOpacity>
                  );
                })}
          </>
        );
      case 'contact':
        return (
          <>
            {objInfo &&
              objInfo.contacts.length > 1 &&
              objInfo.contacts
                .filter(
                  (x) => x.name.trim().toLocaleLowerCase().includes(textFilter.trim().toLocaleLowerCase()) === true,
                )
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
                        value={v.name}
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
      case 'fail':
        return t('lead:reason_select');
      case 'pipe':
        return t('lead:status_select');
      case 'options':
        return t('lead:select_options');
      default:
        return '';
    }
  };

  const onOptions = () => {
    try {
      setOpenModalConfirm(false);
      if (modalType === 'options') {
        setTimeout(() => {
          deleteDeal();
        }, setTimeOut());
      } else {
        if (objectSelectedPipeline.pipelinePositionId === 4) {
          setTimeout(() => {
            openModal('fail');
          }, setTimeOut());
        } else {
          setTimeout(() => {
            changePipeLine({
              dealId: props.route.params.key,
              pipelineId: objectSelectedPipeline.id,
            });
          }, setTimeOut());
        }
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('lead:notice'),
        text2: JSON.stringify(error),
      });
    }
  };

  const deleteDeal = async () => {
    try {
      if (objInfo) {
        appContext.setLoading(true);
        const url = `${serviceUrls.path.getListDeal}?recordId=${objInfo.id.toString()}`;
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
  const isDone = objInfo && objInfo.pipelinePositionId && objInfo.pipelinePositionId === 4 ? true : false;
  let sort: number | number[] = 1;
  let arrPipeLine: PipeLinesDetails[] = objInfo ? objInfo.pipelines : [];
  if (arrPipeLine && arrPipeLine.length > 0 && objInfo && objInfo.currentPipelineId) {
    const findFailIndex = arrPipeLine.findIndex((x) => x.pipelinePositionId === 4);
    const findSuccessIndex = arrPipeLine.findIndex((x) => x.pipelinePositionId === 3);

    const index = arrPipeLine.findIndex((x) => x.id === objInfo.currentPipelineId);
    if (index > -1) {
      sort = arrPipeLine[index].sort;
    }
    if (findFailIndex > -1 && findSuccessIndex > -1) {
      const objPipeLineMix: PipeLinesDetails = {
        id: -99,
        pipelinePositionId: 99,
        sort: arrPipeLine[findFailIndex].sort,
        pipeline1: `${arrPipeLine[findSuccessIndex].pipeline1}/${arrPipeLine[findFailIndex].pipeline1}`,
        pipelineSymbol: `${arrPipeLine[findSuccessIndex].pipelineSymbol}/${arrPipeLine[findFailIndex].pipelineSymbol}`,
      };

      if (!arrPipeLine.some((x) => x.id === -99)) {
        arrPipeLine.push(objPipeLineMix);
      }
      arrPipeLine = arrPipeLine.filter((x) => x.pipelinePositionId !== 4 && x.pipelinePositionId !== 3);
    }
  }
  let contacts: string | null = null;
  if (objInfo && objInfo.contacts && objInfo.contacts.length >= 1) {
    if (objInfo.contacts.length === 1) {
      contacts = objInfo.contacts[0].name;
    } else {
      contacts = `${objInfo.contacts[0].name ?? ''} + ${(objInfo.contacts.length = 1)}`;
    }
  }
  if (objInfo && objInfo.contacts && objInfo.contacts.length > 0) {
    contacts = objInfo.contacts[0].name;
  }
  const isRolePress = objInfo && objInfo.contacts && objInfo.contacts.length > 0 ? true : false;

  return (
    <Host>
      <View style={styles.container}>
        <AppHeaderInfo
          name={objInfo ? objInfo.name : 'N/A'}
          onRightPress={() => openModal('options')}
          onLeftPress={() => {
            dispatch(
              getListDealRequest({
                maxResultCount: 10,
                skipCount: 1,
                organizationUnitId: dealReducer.filter.OrganizationUnitId,
                filterType: dealReducer.filter.filterType,
                filter: dealReducer.filter.filter,
              }),
            );
            if (props.route.params.isGoback) {
              navigation.goBack();
            } else {
              navigation.popToTop();
            }
          }}
          role={contacts}
          textExtra={convertCurrency(objInfo && objInfo.expectationValue ? objInfo.expectationValue : 0)}
          isRolePress={isRolePress}
          onPressWhenManyValues={() => {
            if (objInfo && isArray(objInfo.contacts) && objInfo.contacts.length > 0) {
              if (objInfo.contacts.length > 1) {
                openModal('contact');
              } else {
                navigation.navigate(AppRoutes.DETAIL_CONTACT, { key: objInfo.contacts[0].id, isGoback: true });
              }
            }
          }}
          onMailActions={() => Linking.openURL('mailto:')}
          onEditActions={() => {
            if (objInfo) {
              navigation.navigate(AppRoutes.CREATE_AND_EDIT_LCCD, {
                type: TypeFieldExtension.deal,
                idUpdate: objInfo.id,
              });
            }
          }}
          listPhone={listPhone}
        />
        <View style={styles.pipeLineContainer}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            data={arrPipeLine}
            extraData={arrPipeLine}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={({ item, index }) => {
              return (
                <ItemPipeLine
                  item={item}
                  currentSort={sort}
                  index={index}
                  length={objInfo ? objInfo.pipelines.length : 1}
                  onAction={(object: PipeLinesDetails) => {
                    if (item.id === -99) {
                      setTimeout(() => {
                        openModal('pipe');
                      }, setTimeOut());
                    } else {
                      setModalType('pipe');
                      setOpenModalConfirm(true);
                      setObjectSelectedPipeline(object);
                    }
                  }}
                  isDone={isDone}
                />
              );
            }}
          />
        </View>

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
              if (objInfo) {
                navigation.navigate(AppRoutes.CREATE_AND_EDIT_TASK, {
                  id: objInfo.id,
                  name: objInfo.name,
                  menuId: TypeCriteria.deal,
                  onRefreshing: () => {
                    refreshTab();
                  },
                  typeTab: TypeFieldExtension.deal,
                });
              }
            }}
          />
          <SpeedDialAction
            icon={<MyIcon.Calendar />}
            title={t('button:add_appointment')}
            onPress={() => {
              setOpenSpeedDial(false);
              if (objInfo) {
                navigation.navigate(AppRoutes.CREATE_AND_EDIT_APPOINTMENT, {
                  id: objInfo.id,
                  name: objInfo.name,
                  menuId: TypeCriteria.deal,
                  onRefreshing: () => {
                    refreshTab();
                  },
                  typeTab: TypeFieldExtension.deal,
                });
              }
            }}
          />
          <SpeedDialAction
            icon={<MyIcon.Phone />}
            onPress={() => {
              if (listPhone.length > 0) {
                listPhone[0].function();
              } else {
                Toast.show({
                  type: 'error',
                  text1: t('lead:notice'),
                  text2: t('lead:deal_no_phone'),
                });
              }
            }}
            title={t('button:call')}
          />
          <SpeedDialAction
            icon={<Icon type="antdesign" name="mail" color={color.white} size={fontSize.f14} />}
            title={t('button:email')}
            onPress={() => Linking.openURL('mailto:')}
          />
        </AppSpeedDial>
        <Modal visible={openModalConfirm} transparent animationType="fade">
          <AppConfirm
            title={modalType === 'options' ? t('lead:delete_deal') : t('lead:change_status')}
            content={modalType === 'options' ? `${t('lead:confirm_quest_delete')}` : `${t('lead:confirm_quest')}`}
            colorSubContent={color.black}
            subContent={
              modalType === 'options'
                ? `${objInfo && objInfo.name ? objInfo.name : ''}?`
                : `${objectSelectedPipeline.pipelineSymbol} - ${objectSelectedPipeline.pipeline1}?`
            }
            onPressLeft={() => setOpenModalConfirm(false)}
            onPressRight={() => {
              onOptions();
            }}
          />
        </Modal>
        <Modal visible={openModalNote} transparent animationType="fade">
          <NoteScreen
            typeView={'create'}
            onPressOne={() => setOpenModalNote(false)}
            onPressExtra={() => {
              setOpenModalNote(false);
              dispatch(setRefreshingDealNote(true));
            }}
            idCrnt={dealId || -99}
            itemNote={null}
            typeAPI="deal"
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
            {modalType === 'fail' ? (
              <MyInput.Search
                value={textFilter}
                placeholder={t('lead:reason_select')}
                onChangeText={(text) => {
                  setTextFilter(text);
                }}
              />
            ) : null}

            <ScrollView
              style={{
                paddingBottom: useSafeAreaInsets().bottom,
                height: isIOS || modalType !== 'fail' ? undefined : ScreenHeight * 0.7,
              }}>
              {viewModal()}
            </ScrollView>
          </Modalize>
        </Portal>
      </View>
    </Host>
  );
};

export default DetailsDealScreen;
