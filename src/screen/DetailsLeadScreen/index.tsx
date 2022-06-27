import styles from './styles';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { FlatList, Modal, View, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
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
import { AppHeaderInfo, AppSpeedDial, AppText, SpeedDialAction, AppConfirm } from '@components/index';
import { useTranslation } from 'react-i18next';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@redux/reducers';
import { ItemIconById, ItemPipeLine } from '@components/Item/Details/index';
import {
  detailsLeadInfoRequest,
  setRefreshingLeadActivity,
  setRefreshingLeadAppointment,
  setRefreshingLeadFile,
  setRefreshingLeadInteractive,
  setRefreshingLeadMission,
  setRefreshingLeadNote,
  setRefreshingLeadInfo,
  setEmptyLead,
} from '@redux/actions/detailsActions';
import { getListLeadRequest, setLeadId } from '@redux/actions/leadAction';
import { MyIcon } from '@components/Icon';
import { PipeLinesDetails } from '@interfaces/lead.interface';
import { apiDelete, apiGet, apiPut } from '@services/serviceHandle';
import serviceUrls from '@services/serviceUrls';
import { BodyPipeLine, NavigationDetails } from '@interfaces/params.interface';
import { ResponseReturn } from '@interfaces/response.interface';
import { AppContext } from '@contexts/index';
import { Modalize } from 'react-native-modalize';
import NoteScreen from '@screen/NoteScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TypeCriteria, TypeFieldExtension } from '@helpers/constants';
import { setTimeOut } from '@helpers/untils';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppRoutes } from '@navigation/appRoutes';
import { ItemVel, LeadMobileItem } from '@interfaces/contact.interface';
import Toast from 'react-native-toast-message';
import { isArray } from 'lodash';
import { Portal, Host } from 'react-native-portalize';
import { MyInput } from '@components/Input';
import { screenHeight } from 'react-native-calendars/src/expandableCalendar/commons';

interface ItemModalOptions {
  id: -1 | -99 | 50 | 1;
  name: string;
  actions: () => void;
}

interface IDetailsLead extends NavigationDetails {}

const DetailsLeadScreen = (props: IDetailsLead) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const appContext = useContext(AppContext);
  const bottomSheetModalRef = useRef<Modalize>();
  const { objInfo, leadId } = useSelector((state: RootState) => state.detailsLeadReducer);
  const [index, setIndexCrnt] = useState(props.route.params.page || 0);
  const leadReducer = useSelector((state: RootState) => state.leadReducers);

  const [objectSelectedPipeline, setObjectSelectedPipeline] = useState<PipeLinesDetails>({
    id: -99,
    pipeline1: '',
    sort: -99,
    pipelineSymbol: '',
    pipelinePositionId: -99,
  });
  const [arrFailureReason, setFailureReasons] = useState<ItemVel[]>([]);
  const [modalType, setModalType] = useState<'fail' | 'pipe' | 'options'>('pipe');
  const openModal = (type: 'pipe' | 'fail' | 'options') => {
    setModalType(type);
    bottomSheetModalRef.current?.open();
  };
  const [openSpeedDial, setOpenSpeedDial] = useState(false);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [openModalNote, setOpenModalNote] = useState(false);
  const [textFilter, setTextFilter] = useState('');
  useEffect(() => {
    getFailureReasons();
    dispatch(setLeadId(props.route.params.key));
    dispatch(detailsLeadInfoRequest(props.route.params.key, true));
    return () => {
      dispatch(setRefreshingLeadActivity(true));
      dispatch(setRefreshingLeadAppointment(true));
      dispatch(setRefreshingLeadFile(true));
      dispatch(setRefreshingLeadInteractive(true));
      dispatch(setRefreshingLeadMission(true));
      dispatch(setRefreshingLeadNote(true));
      dispatch(setRefreshingLeadInfo(true));
      dispatch(setEmptyLead());
    };
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      dispatch(setRefreshingLeadActivity(true));
      return () => {};
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
        dispatch(setRefreshingLeadMission(true));
        break;
      }
      case 5: {
        dispatch(setRefreshingLeadAppointment(true));
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

  const arrOptions: ItemModalOptions[] = [
    {
      id: 1,
      name: t('button:update_lead'),
      actions: () => {
        bottomSheetModalRef.current?.close();
        if (objInfo) {
          navigation.navigate(AppRoutes.CREATE_AND_EDIT_LCCD, { type: TypeFieldExtension.lead, idUpdate: objInfo.id });
        }
      },
    },
    {
      id: 50,
      name: t('lead:convert_lead'),
      actions: () => {
        bottomSheetModalRef.current?.close();
        if (objInfo) {
          navigation.navigate(AppRoutes.CONVERT_LEAD, { id: objInfo.id });
        }
      },
    },
    {
      id: -99,
      name: t('lead:delete_lead'),
      actions: () => {
        bottomSheetModalRef.current?.close();
        setOpenModalConfirm(true);
      },
    },
  ];

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
        dispatch(setRefreshingLeadActivity(true));
      }
      if (indexSet === index) {
        return;
      }
      setIndexCrnt(indexSet);
    } catch (error) {}
  };

  ///api
  const getFailureReasons = async () => {
    try {
      const response: ResponseReturn<ItemVel[]> = await apiGet(
        `${serviceUrls.path.failureReason}${TypeCriteria.lead}`,
        {},
      );

      if (response.error) {
        Toast.show({
          type: 'error',
          text1: t('lead:notice'),
          text2: response.detail ? `${JSON.stringify(response.detail)}` : '',
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
        const response: ResponseReturn<boolean> = await apiPut(serviceUrls.path.changeStatusLeadPipeLine, body);
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
          Toast.show({ type: 'error', text1: t('lead:notice'), text2: response.errorMessage });
        } else {
          if (response.response && response.response.data) {
            dispatch(detailsLeadInfoRequest(props.route.params.key, true));
            if (index === 2) {
              dispatch(setRefreshingLeadActivity(true));
            }
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
  const isDone = objInfo && objInfo.pipelinePositionId && objInfo.pipelinePositionId === 4 ? true : false;
  let sort: number | number[] = 1;
  let arrPipeLine: PipeLinesDetails[] = objInfo && objInfo.pipelines ? objInfo.pipelines : [];
  if (arrPipeLine && arrPipeLine.length > 0 && objInfo && objInfo.pipelineId) {
    const findFailIndex = arrPipeLine.findIndex((x) => x.pipelinePositionId === 4);
    const findSuccessIndex = arrPipeLine.findIndex((x) => x.pipelinePositionId === 3);
    const index = arrPipeLine.findIndex((x) => x.id === objInfo.pipelineId);
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
                      bottomSheetModalRef.current?.close();
                      setTimeout(() => {
                        changePipeLine({
                          leadId: props.route.params.key,
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
          deleteLead();
        }, setTimeOut());
      } else {
        if (objectSelectedPipeline.pipelinePositionId === 4) {
          setTimeout(() => {
            openModal('fail');
          }, setTimeOut());
        } else if (objectSelectedPipeline.pipelinePositionId === 3) {
          if (objInfo) {
            navigation.navigate(AppRoutes.CONVERT_LEAD, { id: objInfo.id });
          }
        } else {
          setTimeout(() => {
            changePipeLine({
              leadId: props.route.params.key,
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

  const deleteLead = async () => {
    try {
      if (objInfo) {
        appContext.setLoading(true);
        const url = serviceUrls.path.getListLead + objInfo.id.toString();
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
          name={objInfo && objInfo.fullName ? objInfo.fullName : 'N/A'}
          role={objInfo && objInfo.companyName ? objInfo.companyName : null}
          onRightPress={() => {
            openModal('options');
          }}
          onLeftPress={() => {
            dispatch(
              getListLeadRequest({
                maxResultCount: 10,
                skipCount: 1,
                organizationUnitId: leadReducer.filter.OrganizationUnitId,
                filterType: leadReducer.filter.filterType,
                filter: leadReducer.filter.filter,
              }),
            );
            if (props.route.params.isGoback) {
              navigation.goBack();
            } else {
              navigation.popToTop();
            }
          }}
          isRolePress={!!objInfo?.customerId}
          onPressWhenManyValues={() => {
            if (objInfo?.customerId) {
              navigation.navigate(AppRoutes.DETAIL_CORPORATE, { key: objInfo.customerId, isGoback: true });
            }
          }}
          onMailActions={() => {
            const email = objInfo?.emails?.find((elm) => elm.isMain)?.email ?? 'support@example.com';
            objInfo?.emails && isArray(objInfo?.emails) && objInfo?.emails.length > 0
              ? Linking.openURL(`mailto:${email}`)
              : Linking.openURL('mailto:');
          }}
          onEditActions={() => {
            if (objInfo) {
              navigation.navigate(AppRoutes.CREATE_AND_EDIT_LCCD, {
                type: TypeFieldExtension.lead,
                idUpdate: objInfo.id,
              });
            }
          }}
          listPhone={getListPhone(objInfo?.mobiles || [], objInfo?.fullName || '')}
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
                  length={objInfo ? objInfo.pipelines.length : 0}
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
              setOpenModalNote(true);
              setOpenSpeedDial(false);
            }}
          />
          <SpeedDialAction
            icon={<MyIcon.CarryOut />}
            title={t('button:add_task')}
            onPress={() => {
              setOpenSpeedDial(!openSpeedDial);
              if (objInfo && objInfo.fullName) {
                navigation.navigate(AppRoutes.CREATE_AND_EDIT_TASK, {
                  id: objInfo.id,
                  name: objInfo.fullName,
                  menuId: TypeCriteria.lead,
                  typeTab: TypeFieldExtension.lead,
                  onRefreshing: () => {
                    refreshTab();
                  },
                });
              }
            }}
          />
          <SpeedDialAction
            icon={<MyIcon.Calendar />}
            title={t('button:add_appointment')}
            onPress={() => {
              setOpenSpeedDial(!openSpeedDial);
              navigation.navigate(AppRoutes.CREATE_AND_EDIT_APPOINTMENT, {
                id: objInfo ? objInfo.id : '',
                name: objInfo ? objInfo.fullName : '',
                menuId: TypeCriteria.lead,
                onRefreshing: () => {
                  refreshTab();
                },
                typeTab: TypeFieldExtension.lead,
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
                    name: objInfo.fullName,
                    phone: phone,
                    phoneShow: phoneShow,
                  });
                } else {
                  const phone = `${objInfo.mobiles[0].countryCode}${objInfo.mobiles[0].phoneNational}`;
                  const phoneShow = objInfo.mobiles[0].phoneNumber;
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
                  text2: t('lead:lead_no_phone'),
                });
              }
            }}
            title={t('button:call')}
          />
          <SpeedDialAction
            icon={<Icon type="antdesign" name="mail" color={color.white} size={fontSize.f14} />}
            title={t('button:email')}
            onPress={() => {
              const email = objInfo?.emails?.find((elm) => elm.isMain)?.email ?? 'support@example.com';
              objInfo?.emails && isArray(objInfo?.emails) && objInfo?.emails.length > 0
                ? Linking.openURL(`mailto:${email}`)
                : Linking.openURL('mailto:');
            }}
          />
        </AppSpeedDial>
        <Modal visible={openModalConfirm} transparent animationType="fade">
          <AppConfirm
            title={modalType === 'options' ? t('lead:delete_lead') : t('lead:change_status')}
            content={modalType === 'options' ? `${t('lead:confirm_quest_delete')}` : `${t('lead:confirm_quest')}`}
            colorSubContent={color.black}
            subContent={
              modalType === 'options'
                ? `${objInfo && objInfo.fullName ? objInfo.fullName : ''}?`
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
              dispatch(setRefreshingLeadNote(true));
            }}
            idCrnt={leadId || -99}
            itemNote={null}
            typeAPI="lead"
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
                height: isIOS || modalType !== 'fail' ? undefined : screenHeight * 0.7,
              }}>
              {viewModal()}
            </ScrollView>
          </Modalize>
        </Portal>
      </View>
    </Host>
  );
};

export default DetailsLeadScreen;
