import AppText from '@components/AppText';
import fontSize from '@helpers/fontSize';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Alert, Linking, Modal, TouchableOpacity, View } from 'react-native';
import { color, padding } from '@helpers/index';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import styles from './styles';
import ItemMeeting from './components/ItemMeeting';
import ItemCheckIn from './components/ItemCheck';
import ItemName from './components/ItemName';
import ItemFee from './components/ItemFee';
import { ScrollView } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import ItemCheckContent from './components/ItemCheckContent';
import { apiDelete, apiGet, apiPost, apiPut } from '@services/serviceHandle';
import serviceUrls from '@services/serviceUrls';
import { ItemCosts, ItemLeadDetailData, ItemResultMission } from '@interfaces/lead.interface';
import { ResponseReturn, ResponseReturnArray } from '@interfaces/response.interface';
import { useNavigation } from '@react-navigation/core';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { DATE_TIME_FORMAT, TaskType, TypeCriteria } from '@helpers/constants';
import { NavigationId } from '@interfaces/quickSearch.interface';
import { useDispatch, useSelector } from 'react-redux';
import AppConfirm from '@components/AppConfirm';
import { setTimeOut } from '@helpers/untils';
import Toast from 'react-native-toast-message';
import {
  setRefreshingContactAppointment,
  setRefreshingContactMission,
  setRefreshingCorporateMission,
  setRefreshingDealAppointment,
  setRefreshingDealMission,
  setRefreshingLeadAppointment,
  setRefreshingLeadMission,
} from '@redux/actions/detailsActions';
import ItemBottomSheet from './components/ItemBottomSheet';
import { Modalize } from 'react-native-modalize';
import { AppContext } from '@contexts/index';
import { AppRoutes } from '@navigation/appRoutes';
import AppButton from '@components/AppButton';
import { BodyTaskCheck, ResultLocation } from '@interfaces/task.interface';
import Geolocation from 'react-native-geolocation-service';
import env from '@config/env';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { isIOS } from 'react-native-elements/dist/helpers';
import { MyIcon } from '@components/Icon';
import { ContactPhoneActivity } from '@interfaces/contact.interface';
import { ItemAppMenuProps } from '@components/AppMenu';
import { ItemOptions } from '@components/Item/Details/index';
import { BodyTask } from '@interfaces/params.interface';
import { Portal, Host } from 'react-native-portalize';
import { RootState } from '@redux/reducers';
interface IDetailMeetingProps extends NavigationId {}

const DetailMeetingScreen = (props: IDetailMeetingProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const id = props.route.params.id;
  const type = props.route.params.type;
  const appContext = useContext(AppContext);
  const bottomSheetModalRef = useRef<Modalize>(null);
  const [numberCount, setNumberCount] = useState(0);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isError, setIsError] = useState(false);
  const [isClickCompleted, setIsClickCompleted] = useState(false);
  const [data, setData] = useState<ItemLeadDetailData | null>(null);
  const [bottomSheet, setBottomSheet] = useState<'BotOptions' | 'BotResult'>('BotOptions');
  const { mapInfo } = useSelector((state: RootState) => state.userReducer);
  const [modalType, setModalType] = useState<
    'CheckIn' | 'CheckOut' | 'DeleteTask' | 'DeleteAppointment' | 'ChangeStatus' | null
  >(null);
  const [listPhone, setListPhone] = useState<ItemAppMenuProps[]>([]);
  const [arrResult, setArrResult] = useState<ItemResultMission[]>([]);
  const getResultMission = async () => {
    try {
      const url = serviceUrls.path.resultMisison;
      const response: ResponseReturn<ItemResultMission[]> = await apiGet(url, {});
      if (response.error) {
        return;
      }
      if (response.response && response.response.data) {
        setArrResult(response.response.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (arrResult.length === 0) {
      getResultMission();
    }
    callLeadTaskDetail();
  }, []);
  useEffect(() => {
    const getPhoneList = async () => {
      try {
        const url = serviceUrls.path.getPhoneTask + id;
        const response: ResponseReturn<ContactPhoneActivity[]> = await apiGet(url, {});
        if (response.error) {
          setListPhone([]);
          return;
        }
        if (response.response && response.response.data && response.response.data.length > 0) {
          const arr: ItemAppMenuProps[] = [];
          for (let index = 0; index < response.response.data.length; index++) {
            const element = response.response.data[index];
            if (element.phoneNumber.length > 0) {
              for (let jndex = 0; jndex < element.phoneNumber.length; jndex++) {
                const elementChild = element.phoneNumber[index];
                const obj: ItemAppMenuProps = {
                  title: elementChild.phoneNumber.trim(),
                  function: () => {
                    const phone = `${elementChild.countryCode}${elementChild.phoneNational}`;
                    const phoneShow = elementChild.phoneE164;
                    navigation.navigate(AppRoutes.CALL, {
                      name: data?.recordName,
                      phone: phone,
                      phoneShow: phoneShow,
                    });
                  },
                  titleStyle: { color: element.isMain ? color.navyBlue : color.black },
                  icon: <MyIcon.CallModal />,
                };
                arr.push(obj);
              }
            }
          }
          setListPhone(arr);
        }
      } catch (error) {}
    };
    getPhoneList();
  }, [data?.recordName]);

  const [checkingLocation, setCheckingLocation] = useState<BodyTaskCheck>({
    id: id || '',
    latitude: 0,
    longtitude: 0,
    place: '',
    placeId: '',
  });
  const isTask =
    data &&
    data.type &&
    (data.type === TaskType.callPhone || data.type === TaskType.callPrice || data.type === TaskType.sendEmail);

  const setTextByType = () => {
    if (data) {
      switch (data.type) {
        case TaskType.meetCustomer:
          return t('lead:meet_customer');
        case TaskType.callPhone:
          return t('lead:call_phone');
        case TaskType.callPrice:
          return t('lead:call_price');
        case TaskType.sendEmail:
          return t('lead:send_mail');
        case TaskType.meeting:
          return t('lead:meeting');
        case TaskType.demoProduct:
          return t('lead:demo_product');
        case TaskType.other:
          return t('lead:other');
        default:
          return t('lead:other');
      }
    } else {
      return t('lead:other');
    }
  };
  const setCompleteTypeNoti = () => {
    if (isTask) {
      setContent(t('label:completeMission'));
    } else {
      setContent(t('label:completeAppointment'));
    }
  };

  const setRefreshing = () => {
    if (type === 'lead') {
      if (isTask) {
        dispatch(setRefreshingLeadMission(true));
        return;
      }
      dispatch(setRefreshingLeadAppointment(true));
    } else if (type === 'contact') {
      if (isTask) {
        dispatch(setRefreshingContactMission(true));
        return;
      }
      dispatch(setRefreshingContactAppointment(true));
    } else if (type === 'corporate') {
      if (isTask) {
        dispatch(setRefreshingCorporateMission(true));
        return;
      }
    } else {
      if (isTask) {
        dispatch(setRefreshingDealMission(true));
        return;
      }
      dispatch(setRefreshingDealAppointment(true));
    }
  };

  const changeStatus = async (id: number | string, type: string) => {
    try {
      const url = `${serviceUrls.path.changeStatus.replace('{type}', type)}${id}?status=true`;
      const response: ResponseReturn<boolean> = await apiPut(url, {});
      if (response.error) {
        appContext.setLoading(false);
        Toast.show({ type: 'error', text1: t('lead:notice'), text2: response.errorMessage });
        return;
      }
      if (response.response && response.response.data) {
        setNumberCount(numberCount + 1);
        Toast.show({
          type: 'success',
          text1: t('lead:notice'),
          text2: t('lead:completed_appointment'),
        });
        callLeadTaskDetail();
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

  const deleteItemCost = async (id: number) => {
    try {
      appContext.setLoading(true);
      const url = `${serviceUrls.path.createCost}${id}`;
      const response: ResponseReturn<boolean> = await apiDelete(url, {});
      if (response.error) {
        Toast.show({ type: 'error', text1: t('lead:notice'), text2: response.errorMessage });
        return;
      }
      if (response.response && response.response.data) {
        Toast.show({
          type: 'success',
          text1: t('lead:notice'),
          text2: t('lead:delete_cost_success'),
        });
        callLeadTaskDetail();
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: t('lead:notice'), text2: JSON.stringify(error) });
    } finally {
      appContext.setLoading(false);
    }
  };
  const deleteItemTask = async (menuId: number) => {
    try {
      appContext.setLoading(true);
      const url = `${serviceUrls.path.deleteTask.replace('{id}', id)}${menuId}`;
      const response: ResponseReturn<boolean> = await apiDelete(url, {});
      if (response.error) {
        Toast.show({ type: 'error', text1: t('lead:notice'), text2: response.errorMessage });
        return;
      }
      if (response.response && response.response.data) {
        Toast.show({
          type: 'success',
          text1: t('lead:notice'),
          text2: t('lead:delete_task_success'),
        });
        setRefreshing();
        navigation.goBack();
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: t('lead:notice'), text2: JSON.stringify(error) });
    } finally {
      appContext.setLoading(false);
    }
  };
  const deleteItemAppointment = async (menuId: number) => {
    try {
      appContext.setLoading(true);
      const url = `${serviceUrls.path.deleteAppointment.replace('{id}', id)}${menuId}`;
      const response: ResponseReturn<boolean> = await apiDelete(url, {});
      if (response.error) {
        Toast.show({ type: 'error', text1: t('lead:notice'), text2: response.errorMessage });
        return;
      }
      if (response.response && response.response.data) {
        Toast.show({
          type: 'success',
          text1: t('lead:notice'),
          text2: t('lead:delete_appointment_success'),
        });
        setRefreshing();
        navigation.goBack();
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: t('lead:notice'), text2: JSON.stringify(error) });
    } 
  };
  const callLeadTaskDetail = async () => {
    try {
      appContext.setLoading(true);
      const response: ResponseReturn<ItemLeadDetailData> = await apiGet(`${serviceUrls.path.leadTaskDetail}${id}`, {});
      if (response.error) {
        Toast.show({
          type: 'error',
          text1: t('lead:notice'),
          text2: response.errorMessage || response.detail || '',
        });
        setIsError(true);
      }
      if (response.response && response.response.data) {
        setIsError(false);
        setData(response.response.data);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('lead:notice'),
        text2: JSON.stringify(error),
      });
      setIsError(true);
    } finally {
      appContext.setLoading(false);
    }
  };

  const updateResult = async (resultId: number) => {
    try {
      appContext.setLoading(true);
      const url = serviceUrls.path.changeResultTask;
      let obj: BodyTask | null = null;
      if (data) {
        obj = {
          id: id,
          result: resultId,
          type: 2,
        };
      }
      const response: ResponseReturn<boolean> = await apiPut(url, obj);
      if (response.error) {
        Toast.show({
          type: 'error',
          text1: t('lead:notice'),
          text2: response.errorMessage || response.detail || '',
        });
        appContext.setLoading(false);
        return;
      }
      if (response.response && response.response.data) {
        if (data) {
          changeStatus(id, type);
        }
      }
    } catch (error) {
      appContext.setLoading(false);
      Toast.show({
        type: 'error',
        text1: t('lead:notice'),
        text2: JSON.stringify(error),
      });
    }
  };

  const checkIn = async (body: BodyTaskCheck) => {
    try {
      appContext.setLoading(true);
      const response: ResponseReturn<boolean> = await apiPost(serviceUrls.path.checkIn, body);
      if (!response.error) {
        Toast.show({ type: 'success', text1: t('lead:notice'), text2: t('label:checkInSuccess') });
        setNumberCount(numberCount + 1);
        callLeadTaskDetail();
      }
      if (response.error) {
        Toast.show({ type: 'error', text1: t('lead:notice'), text2: response.errorMessage });
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: t('lead:notice'), text2: JSON.stringify(error) });
    } finally {
      appContext.setLoading(false);
    }
  };
  const checkOut = async (body: BodyTaskCheck) => {
    try {
      appContext.setLoading(true);
      const response: ResponseReturn<boolean> = await apiPost(serviceUrls.path.checkOut, body);
      if (!response.error) {
        Toast.show({ type: 'success', text1: t('lead:notice'), text2: t('label:checkOutSuccess') });
        setNumberCount(numberCount + 1);
        callLeadTaskDetail();
        if (isClickCompleted) {
          setBottomSheet('BotResult');
          bottomSheetModalRef.current?.open();
        }
      }
      if (response.error) {
        Toast.show({ type: 'error', text1: t('lead:notice'), text2: response.errorMessage });
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: t('lead:notice'), text2: JSON.stringify(error) });
    } finally {
      appContext.setLoading(false);
    }
  };

  const requestPermissionLocation = async () => {
    check(isIOS ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          Alert.alert('Error', 'This feature is not available (on this device / in this context)', [
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {},
            },
          ]);
          break;
        case RESULTS.DENIED:
          Alert.alert(t('title:the_permission_is_denied'), t('label:permission_location_request'), [
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                setTimeout(() => {
                  Linking.openSettings();
                }, 1000);
              },
            },
          ]);
          break;
        case RESULTS.LIMITED:
          console.log('The permission is limited: some actions are possible');
          break;
        case RESULTS.GRANTED:
          getOneTimeLocation();
          break;
        case RESULTS.BLOCKED:
          Alert.alert(t('title:the_permission_is_denied'), t('label:permission_location_request'), [
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                setTimeout(() => {
                  Linking.openSettings();
                }, 1000);
              },
            },
          ]);
          break;
      }
    });
  };
  const getOneTimeLocation = async () => {
    Geolocation.getCurrentPosition(
      (position) => {
        getLocationAndCheck(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        Toast.show({ type: 'error', text1: t('lead:notice'), text2: JSON.stringify(error) });
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 3600000,
      },
    );
  };
  const getLocationAndCheck = async (lat: number, long: number) => {
    try {
      if (data) {
        appContext.setLoading(true);
        const url = serviceUrls.goongMapParamsLatLongUrl(lat, long);
        const params = {
          api_key: mapInfo?.key,
        };
        const response: ResponseReturnArray<ResultLocation> = await apiGet(url, params);
        if (response.error) {
          appContext.setLoading(false);
          return;
        }
        if (response.response && response.response.results && response.response.results.length > 0) {
          const result1 = response.response.results[0];
          setCheckingLocation({
            id: data.id,
            latitude: result1.geometry.location.lat,
            longtitude: result1.geometry.location.lng,
            place: result1.formatted_address,
            placeId: result1.place_id,
          });
          setTimeout(() => {
            setModalType(data.isCheckIn ? 'CheckOut' : 'CheckIn');
            setContent(result1.formatted_address || '');
          }, setTimeOut());
        }
      }
    } catch (error) {
    } finally {
      appContext.setLoading(false);
    }
  };

  const onModalConfirm = () => {
    switch (modalType) {
      case 'ChangeStatus':
        setModalType(null);
        setBottomSheet('BotResult');
        bottomSheetModalRef.current?.open();
        break;
      case 'CheckIn':
        checkIn(checkingLocation);
        setModalType(null);
        break;
      case 'CheckOut':
        checkOut(checkingLocation);
        setModalType(null);
        break;
      case 'DeleteAppointment':
        if (data && data.root) {
          deleteItemAppointment(data.root);
        }
        setModalType(null);
        break;
      case 'DeleteTask':
        if (data && data.root) {
          deleteItemTask(data.root);
        }
        setModalType(null);
        break;
      default:
        break;
    }
  };
  const renderBotSheet = () => {
    switch (bottomSheet) {
      case 'BotOptions':
        return (
          <ItemBottomSheet
            type={isTask ? t('label:delete_mission') : t('label:delete_appointment')}
            onPress={(id: number) => {
              bottomSheetModalRef.current?.close();
              if (id === 1) {
                navigation.navigate(AppRoutes.COST, {
                  taskId: data && data.id ? data.id : '',
                  isAddCost: true,
                  onRefreshing: () => {
                    callLeadTaskDetail();
                  },
                });
              } else {
                setTitle(isTask ? t('label:delete_mission') : t('label:delete_appointment'));
                setContent(isTask ? t('lead:confirm_delete_mission') : t('lead:confirm_delete_appointment'));
                setModalType(isTask ? 'DeleteTask' : 'DeleteAppointment');
              }
            }}
          />
        );
      case 'BotResult':
        return (
          <>
            {arrResult.map((v, i) => {
              return (
                <ItemOptions
                  key={v.label}
                  value={v.value}
                  onPress={() => {
                    bottomSheetModalRef.current?.close();
                    updateResult(v.label);
                  }}
                />
              );
            })}
          </>
        );
    }
  };
  const renderPlace = () => {
    if (data === null) {
      return null;
    }
    if (!data.isCheckIn && !data.isCheckOut) {
      return (
        <>
          <ItemCheckIn
            content=""
            checkStatus="Check-in"
            onPressCheckIn={() => {
              setTitle(t('label:checkInConfirm'));
              requestPermissionLocation();
              setIsClickCompleted(false);
            }}
          />
        </>
      );
    } else if (data.isCheckIn || data.isCheckOut) {
      const checkOut = data.locates.find((x) => x.type === 2);
      const checkIn = data.locates.find((x) => x.type === 1);
      return (
        <>
          <ItemMeeting iconSize={16} iconName="near-me" iconType="material-icons" content="Check-in" />
          <ItemCheckContent
            location={checkIn ? checkIn.place || '' : data.place || ''}
            time={checkIn ? dayjs(checkIn.creationTime).format(DATE_TIME_FORMAT).toString() : ''}
          />
          {data.isCheckOut ? (
            <>
              <ItemMeeting iconSize={16} iconName="near-me" iconType="material-icons" content="Check-out" />
              <ItemCheckContent
                location={checkOut ? checkOut.place || '' : data.place || ''}
                time={checkOut ? dayjs(checkOut.creationTime).format(DATE_TIME_FORMAT).toString() : ''}
              />
            </>
          ) : (
            <ItemCheckIn
              content=""
              checkStatus="Check out"
              onPressCheckIn={() => {
                setIsClickCompleted(false);
                setTitle(t('label:checkOutConfirm'));
                requestPermissionLocation();
              }}
            />
          )}
        </>
      );
    } else {
      return null;
    }
  };
  const countTotalTime = () => {
    if (data != null && data.locates.length === 2 && data.locates[1].creationTime && data.locates[0].creationTime) {
      const checkOut = data.locates.find((x) => x.type === 2);
      const checkIn = data.locates.find((x) => x.type === 1);
      if (checkOut && checkIn) {
        const durationMin = dayjs(checkOut.creationTime).diff(checkIn.creationTime, 'minutes');
        const durationHours = dayjs(checkOut.creationTime).diff(checkIn.creationTime, 'hours');
        const durationSec = dayjs(checkOut.creationTime).diff(checkIn.creationTime, 'seconds');

        const totalTime = `${durationHours !== 0 ? `${durationHours} ${t('label:hours')} ` : ''}${
          durationMin !== 0 ? `${durationMin - durationHours * 60} ${t('label:minutes')} ` : ''
        }${durationSec !== 0 ? `${durationSec - durationMin * 60} ${t('title:second')} ` : ''}`;
        return totalTime;
      } else {
        return '';
      }
    }
    return '';
  };

  const getDetails = () => {
    try {
      if (data && data.root && data.recordId) {
        switch (data.root) {
          case TypeCriteria.lead:
            navigation.navigate(AppRoutes.DETAIL_LEAD, { key: data.recordId, isGoback: true });
            break;
          case TypeCriteria.deal:
            navigation.navigate(AppRoutes.DETAIL_DEAL, { key: data.recordId, isGoback: true });
            break;
          case TypeCriteria.contact:
            navigation.navigate(AppRoutes.DETAIL_CONTACT, { key: data.recordId, isGoback: true });
            break;
          case TypeCriteria.corporate:
            navigation.navigate(AppRoutes.DETAIL_CORPORATE, { key: data.recordId, isGoback: true });
            break;
          default:
            break;
        }
      }
    } catch (error) {}
  };
  console.log('//////', data);
  return (
    <Host>
      <SafeAreaView edges={['top']} style={{ backgroundColor: color.white, flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              if (numberCount > 0) {
                setRefreshing();
              }
              navigation.goBack();
            }}
            style={styles.back}>
            <AntDesign name="left" size={fontSize.f24} color={color.icon} />
          </TouchableOpacity>
          <View style={styles.right}>
            <TouchableOpacity
              onPress={() => {
                if (data) {
                  navigation.navigate(isTask ? AppRoutes.CREATE_AND_EDIT_TASK : AppRoutes.CREATE_AND_EDIT_APPOINTMENT, {
                    taskId: data.id,
                    onRefreshing: () => {
                      callLeadTaskDetail();
                      setNumberCount(numberCount + 1);
                    },
                  });
                }
              }}
              style={{ marginRight: padding.p24 }}>
              <AntDesign name="edit" size={fontSize.f24} color={color.icon} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setBottomSheet('BotOptions');
                bottomSheetModalRef.current?.open();
              }}
              style={{ marginRight: padding.p12 }}>
              <Feather name="more-vertical" size={fontSize.f22} color={color.icon} />
            </TouchableOpacity>
          </View>
        </View>
        {isError ? (
          <View style={styles.loading}>
            <AppButton title={t('lead:reload')} onPress={() => {}} buttonStyle={styles.btn} />
            <AppText value={t('lead:error_data').toString()} />
          </View>
        ) : null}

        {data ? (
          <>
            <View style={{ flex: 1 }}>
              <ScrollView>
                <ItemMeeting
                  iconName="calendar"
                  iconType="material-community"
                  content={data && data.title ? data.title : ''}
                  note={setTextByType() ?? ''}
                  iconSize={fontSize.f17}
                  sizeContent={fontSize.f16}
                  taskType={data?.type}
                />
                <ItemMeeting
                  iconSize={16}
                  iconName="clockcircleo"
                  iconType="antdesign"
                  subContent={
                    data.duration
                      ? dayjs(data.duration).format(DATE_TIME_FORMAT).toString()
                      : dayjs(data.startDate).format(DATE_TIME_FORMAT).toString() +
                          ' - ' +
                          dayjs(data.endDate).format(DATE_TIME_FORMAT).toString() ?? ''
                  }
                />
                {!!data?.place && (
                  <ItemMeeting iconName="enviroment" iconType="antdesign" subContent={data?.place || ''} />
                )}
                {!isTask && renderPlace()}
                {data.isCheckIn && data.isCheckOut ? (
                  <AppText
                    style={{ marginLeft: padding.p44, marginTop: padding.p10 }}
                    fontSize={fontSize.f14}
                    fontWeight="medium">
                    {t('label:totalTime')}
                    <AppText value={countTotalTime()} fontSize={fontSize.f14} fontWeight="normal" />
                  </AppText>
                ) : null}

                <ItemMeeting iconName="person" iconType="materialicons" content={t('label:object')} />
                {data.recordName && (
                  <ItemName
                    listPhone={listPhone}
                    itemName={data.recordName || ''}
                    itemNameColor={color.navyBlue}
                    backgroundColorAvatar={color.pinky}
                    isCall={true}
                    onPress={() => {
                      getDetails();
                    }}
                  />
                )}

                <ItemMeeting iconName="person" iconType="materialicons" content={t('label:relativeObject')} />
                {data.ownerName && (
                  <ItemName
                    isCall={false}
                    itemName={data.ownerName || ''}
                    itemNameColor={color.text}
                    backgroundColorAvatar={color.mint}
                  />
                )}

                {data.collaborators && data.collaborators.length > 0 && (
                  <>
                    <ItemMeeting iconName="people" iconType="materialicons" content={t('label:collaborators')} />
                    {data.collaborators.map((v, i) => {
                      return (
                        <ItemName
                          key={i}
                          itemName={v.name}
                          itemNameColor={color.black}
                          backgroundColorAvatar={color.purple}
                          isCall={false}
                        />
                      );
                    })}
                  </>
                )}

                {data.description ? (
                  <ItemMeeting iconName="file-document" iconType="material-community" subContent={data.description} />
                ) : null}
                {data.costs ? (
                  <>
                    <ItemMeeting
                      iconName="alpha-s-circle"
                      iconType="material-community"
                      content={t('label:totalCost')}
                      subContent={data.costs.reduce((a, v) => (a = a + v.price), 0).toString() + 'đ'}
                    />
                    {data.costs.map((v, i) => {
                      return (
                        <ItemFee
                          item={v}
                          onDelete={() => {
                            deleteItemCost(v.id);
                          }}
                          onEdit={(item: ItemCosts) => {
                            navigation.navigate(AppRoutes.COST, {
                              taskId: item.id,
                              isAddCost: false,
                              item,
                              onRefreshing: () => {
                                callLeadTaskDetail();
                              },
                            });
                          }}
                        />
                      );
                    })}
                  </>
                ) : null}

                {data.completed && (
                  <>
                    <ItemMeeting
                      iconSize={16}
                      subContent={`${t('label:done')}: ${dayjs(data.finishDay).format(DATE_TIME_FORMAT)}`}
                      iconType="antdesign"
                      iconName="checkcircle"
                    />
                    {data.resultName && (
                      <AppText
                        style={{ marginLeft: padding.p44, marginTop: padding.p8 }}
                        value={`${t('input:result')}: ${data.resultName || ''}`}
                        fontSize={fontSize.f14}
                      />
                    )}
                  </>
                )}
              </ScrollView>
            </View>
            {!data.completed && (
              <TouchableOpacity
                style={[styles.bottomView]}
                onPress={() => {
                  if (data) {
                    if ((!data.isCheckIn && !data.isCheckOut) || (data.isCheckIn && data.isCheckOut)) {
                      setTitle(t('label:finishConfirm'));
                      setCompleteTypeNoti();
                      setIsClickCompleted(true);
                      setModalType('ChangeStatus');
                    } else {
                      if (!data.isCheckOut) {
                        setIsClickCompleted(true);
                        setTitle(t('lead:confirm_checkOut_before'));
                        requestPermissionLocation();
                      }
                    }
                  }
                }}>
                <Icon
                  type="antdesign"
                  name="checkcircle"
                  size={fontSize.f14}
                  color={color.green900}
                  style={{ marginRight: padding.p10, marginBottom: padding.p14 }}
                />
                <AppText value={t('label:done').toString()} fontSize={14} style={styles.bottomText} />
              </TouchableOpacity>
            )}
          </>
        ) : null}

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalType !== null}
          onRequestClose={() => {
            setModalType(null);
          }}>
          <AppConfirm
            content={content || ''}
            title={title}
            onPressLeft={() => {
              setModalType(null);
            }}
            onPressRight={() => {
              setModalType(null);
              setTimeout(() => {
                onModalConfirm();
              }, setTimeOut());
            }}
            textBtnRight={data && data.isCheckIn && isClickCompleted ? 'Check-out' : t('label:accept')}
          />
        </Modal>
        <Portal>
          <Modalize
            adjustToContentHeight
            withHandle={false}
            ref={bottomSheetModalRef}
            HeaderComponent={() => {
              if (bottomSheet === 'BotResult') {
                return (
                  <View style={styles.headerBotSheet}>
                    <View style={styles.leftHeader} />
                    <View style={styles.centerHeader}>
                      <AppText
                        value={t('lead:result_select').toString()}
                        fontSize={fontSize.f16}
                        fontWeight="semibold"
                      />
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        appContext.setLoading(false);
                        bottomSheetModalRef.current?.close();
                        setTimeout(() => {
                          changeStatus(id, type);
                        }, setTimeOut());
                      }}
                      style={styles.rightHeader}>
                      {bottomSheet === 'BotResult' ? (
                        <AppText value={t('lead:skip').toString()} color={color.mainBlue} fontSize={fontSize.f14} />
                      ) : null}
                    </TouchableOpacity>
                  </View>
                );
              }
            }}>
            {renderBotSheet()}
          </Modalize>
        </Portal>
      </SafeAreaView>
    </Host>
  );
};
export default DetailMeetingScreen;
