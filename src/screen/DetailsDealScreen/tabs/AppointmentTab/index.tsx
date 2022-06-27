import styles from './styles';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Linking, FlatList, Modal, View, TouchableOpacity } from 'react-native';
import { color, fontSize } from '@helpers/index';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/reducers';
import { detailsDealAppointmentRequest, setRefreshingDealAppointment } from '@redux/actions/detailsActions';
import { ItemAppointment } from '@components/Item/Details/index';
import { SelectButton, AppEmptyViewList, ModalDate, AppConfirm, AppText } from '@components/index';
import { apiGet, apiPost, apiPut } from '@services/serviceHandle';
import serviceUrls from '@services/serviceUrls';
import { ResponseReturn, ResponseReturnArray } from '@interfaces/response.interface';
import { AppContext } from '@contexts/index';
import { DATE_FORMAT, DATE_FORMAT_EN, ModalizeDetailsType, TypeFieldExtension } from '@helpers/constants';
import { Modalize } from 'react-native-modalize';
import dayjs from 'dayjs';
import { Portal } from 'react-native-portalize';
import { setTimeOut } from '@helpers/untils';
import Geolocation from 'react-native-geolocation-service';
import env from '@config/env';
import Toast from 'react-native-toast-message';
import { BodyTaskCheck, ResultLocation } from '@interfaces/task.interface';
import { ItemTask } from '@interfaces/lead.interface';
import AppointmentBottomSheet from '@components/Details/AppointmentBottomSheet';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { isIOS } from 'react-native-elements/dist/helpers';
import { Alert } from 'react-native';
import { BodyTask } from '@interfaces/params.interface';
interface IAppointmentTab {}

const AppointmentTab = (props: IAppointmentTab) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const appContext = useContext(AppContext);
  const { mapInfo } = useSelector((state: RootState) => state.userReducer);
  const { objAppointment, dealId } = useSelector((state: RootState) => state.detailsDealReducer);
  const [modalType, setModalType] = useState<'ModalDate' | 'ModalFilter' | 'ModalItem'>('ModalDate');
  const bottomSheetModalRef = useRef<Modalize>();
  const [isComplete, setIsComplete] = useState(false);
  const [openModalConfirmTask, setOpenModalConfirmTask] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<ItemTask | null>(null);
  const [checkingLocation, setCheckingLocation] = useState<BodyTaskCheck>({
    id: '',
    latitude: 0,
    longtitude: 0,
    place: '',
    placeId: '',
  });
  const [dateFilter, setDateFilter] = useState(dayjs().format(DATE_FORMAT_EN).toString());
  const [idFilter, setIdFilter] = useState(-99);
  useEffect(() => {
    if (objAppointment.load.isRefreshing) {
      dispatch(detailsDealAppointmentRequest(dealId ?? '', dateFilter, idFilter));
    }
  }, [objAppointment.load.isRefreshing]);

  const contentConfirm = () => {
    let content = t('input:done_confirm') + '?';
    if (
      !isComplete ||
      (selectedAppointment && isComplete && !selectedAppointment.isCheckOut && selectedAppointment.isCheckIn)
    ) {
      content = checkingLocation.place;
    }
    return content;
  };
  const titleConfirm = () => {
    let title = t('lead:confirm');
    if (selectedAppointment) {
      if (isComplete) {
        if (selectedAppointment.isCheckOut || (!selectedAppointment.isCheckIn && !selectedAppointment.isCheckOut)) {
          title = t('lead:confirm');
        } else {
          title = t('lead:confirm_checkOut_before');
        }
      } else {
        if (selectedAppointment.isCheckIn) {
          title = t('lead:confirm_check_out');
        } else {
          title = t('lead:confirm_check_in');
        }
      }
    }
    return title;
  };
  const getTitle = () => {
    switch (modalType) {
      case 'ModalFilter':
        return t('lead:status_select').toString();
      case 'ModalDate':
        return '';
      case 'ModalItem':
        return t('lead:result_select').toString();
    }
  };

  const updateResult = async (resultId: number) => {
    try {
      appContext.setLoading(true);
      const url = serviceUrls.path.changeResultTask;
      let obj: BodyTask | null = null;
      if (selectedAppointment) {
        obj = {
          id: selectedAppointment.id,
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
        if (selectedAppointment) {
          changeStatus(selectedAppointment.id);
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
  const changeStatus = async (id: number | string) => {
    try {
      appContext.setLoading(true);
      const url = `${serviceUrls.path.changeStatusDealTask}${id}?status=true`;
      const response: ResponseReturn<boolean> = await apiPut(url, {});
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
        Toast.show({
          type: 'success',
          text1: t('lead:notice'),
          text2: t('lead:completed_appointment'),
        });
        setSelectedAppointment(null);
        dispatch(setRefreshingDealAppointment(true));
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

  const openModal = (type: 'ModalDate' | 'ModalFilter' | 'ModalItem') => {
    setModalType(type);
    bottomSheetModalRef.current?.open();
  };

  const openModalConfirm = (isCompleted: boolean, item: ItemTask, isClickCompleted: boolean) => {
    setSelectedAppointment(item);
    setIsComplete(isClickCompleted);
    if (isCompleted) {
      setOpenModalConfirmTask(true);
    } else {
      requestPermissionLocation();
    }
  };

  const renderModalContent = () => {
    switch (modalType) {
      case 'ModalDate':
        return (
          <ModalDate
            handleConfirm={(date) => {
              setDateFilter(dayjs(date).format(DATE_FORMAT_EN).toString());
              setTimeout(() => {
                dispatch(setRefreshingDealAppointment(true));
              }, setTimeOut());
            }}
            handleCancel={() => bottomSheetModalRef.current?.close()}
            date={dayjs(dateFilter).toDate()}
            titleCalendar={t('business:selectDay')}
          />
        );
      case 'ModalFilter':
        return (
          <AppointmentBottomSheet
            type={ModalizeDetailsType.filter}
            onPress={(id: number) => {
              setIdFilter(id);
              setTimeout(() => {
                dispatch(setRefreshingDealAppointment(true));
              }, setTimeOut());
              bottomSheetModalRef.current?.close();
            }}
          />
        );
      case 'ModalItem':
        return (
          <AppointmentBottomSheet
            type={ModalizeDetailsType.item}
            onPress={(id: number) => {
              bottomSheetModalRef.current?.close();
              updateResult(id);
            }}
          />
        );
      default:
        return null;
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
          getPosition();
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
  const getPosition = async () => {
    appContext.setLoading(true);
    const requestLocationPermission = async () => {
      Geolocation.getCurrentPosition(
        (position) => {
          getLocation(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          Toast.show({
            type: 'error',
            text1: t('lead:notice'),
            text2: error?.message || '',
          });
          if (error.code === 1) {
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
          }
          appContext.setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 1000000,
          maximumAge: 2000,
        },
      );
    };
    requestLocationPermission();
  };
  const getLocation = async (lat: number, long: number) => {
    try {
      const url = serviceUrls.goongMapParamsLatLongUrl(lat, long);
      const response: ResponseReturnArray<ResultLocation> = await apiGet(url, {
        api_key: mapInfo?.key,
      });
      if (response.error) {
        appContext.setLoading(false);
        return;
      }
      if (response.response && response.response.results && response.response.results.length > 0) {
        const result1 = response.response.results[0];
        setCheckingLocation({
          id: '',
          latitude: result1.geometry.location.lat,
          longtitude: result1.geometry.location.lng,
          place: result1.formatted_address || '',
          placeId: result1.place_id,
        });
        setTimeout(() => {
          setOpenModalConfirmTask(true);
        }, setTimeOut());
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
  const checkInCheckOut = async () => {
    try {
      if (selectedAppointment) {
        if (
          (selectedAppointment.isCheckIn && selectedAppointment.isCheckOut) ||
          (!selectedAppointment.isCheckIn && !selectedAppointment.isCheckOut && isComplete)
        ) {
          openModal('ModalItem');
        } else {
          appContext.setLoading(true);
          const body: BodyTaskCheck = {
            id: selectedAppointment.id,
            latitude: checkingLocation.latitude,
            longtitude: checkingLocation.longtitude,
            placeId: checkingLocation.placeId,
            place: checkingLocation.place,
          };
          const url = selectedAppointment.isCheckIn ? serviceUrls.path.checkOut : serviceUrls.path.checkIn;
          const response: ResponseReturn<boolean> = await apiPost(url, body);
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
            Toast.show({
              type: 'success',
              text1: t('lead:notice'),
              text2: selectedAppointment.isCheckIn ? t('label:checkOutSuccess') : t('label:checkInSuccess'),
            });
            if (selectedAppointment.isCheckIn && isComplete) {
              openModal('ModalItem');
            } else {
              dispatch(setRefreshingDealAppointment(true));
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

  const arrFilter = [
    {
      id: -99,
      name: t('lead:all_status'),
      isCompleted: null,
      isExpired: null,
    },
    {
      id: 2,
      name: t('lead:incomplete'),
      isCompleted: false,
      isExpired: null,
    },
    {
      id: 1,
      name: t('lead:complete_in'),
      isCompleted: true,
      isExpired: true,
    },
    {
      id: 3,
      name: t('lead:complete_out'),
      isCompleted: true,
      isExpired: false,
    },
  ];
  arrFilter.sort((a, b) => {
    return a.id - b.id;
  });

  let obj: { id: number; name: string; isCompleted: boolean | null; isExpired: boolean | null } = {
    id: -99,
    name: t('lead:all_status'),
    isCompleted: null,
    isExpired: null,
  };
  const findIndex = arrFilter.findIndex((x) => x.id === idFilter);
  if (findIndex > -1) {
    obj = arrFilter[findIndex];
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: objAppointment.arrAppointment.length === 0 ? color.white : color.lightGray },
      ]}>
      <View style={styles.viewFilter}>
        <SelectButton
          titleStyle={{ color: color.subText }}
          themeColor={color.subText}
          onPress={() => {
            openModal('ModalDate');
          }}
          title={
            dayjs().isSame(dayjs(dateFilter).toDate(), 'date')
              ? t('title:today')
              : dayjs(dateFilter).format(DATE_FORMAT)
          }
        />
        <SelectButton
          titleStyle={{ color: color.subText }}
          themeColor={color.subText}
          onPress={() => {
            openModal('ModalFilter');
          }}
          title={obj.name}
        />
      </View>
      <FlatList
        refreshing={objAppointment.load.isRefreshing}
        onRefresh={() => {
          dispatch(setRefreshingDealAppointment(true));
        }}
        data={objAppointment.arrAppointment}
        extraData={objAppointment.arrAppointment}
        keyExtractor={(item, index) => item.id}
        renderItem={({ item, index }) => (
          <ItemAppointment
            type={TypeFieldExtension.deal}
            item={item}
            checkInCheckOut={() => {
              openModalConfirm(false, item, false);
            }}
            onPress={() => {
              if ((item.isCheckIn && item.isCheckOut) || (!item.isCheckIn && !item.isCheckOut)) {
                openModalConfirm(true, item, true);
              } else {
                openModalConfirm(item.isCheckOut, item, true);
              }
            }}
          />
        )}
        ItemSeparatorComponent={() => {
          return <View style={styles.lineSepe} />;
        }}
        ListEmptyComponent={() => {
          return (
            <AppEmptyViewList
              isRefreshing={objAppointment.load.isRefreshing}
              isErrorData={objAppointment.load.isError}
              onReloadData={() => dispatch(setRefreshingDealAppointment(true))}
            />
          );
        }}
      />
      <Modal visible={openModalConfirmTask} transparent animationType="fade">
        <AppConfirm
          title={titleConfirm()}
          content={contentConfirm()}
          textBtnRight={
            selectedAppointment && selectedAppointment.isCheckIn && isComplete ? 'Check-out' : t('lead:confirm')
          }
          onPressLeft={() => {
            setOpenModalConfirmTask(false);
            appContext.setLoading(false);
          }}
          onPressRight={() => {
            setOpenModalConfirmTask(false);
            setTimeout(() => {
              checkInCheckOut();
            }, setTimeOut());
          }}
        />
      </Modal>
      <Portal>
        <Modalize
          adjustToContentHeight
          HeaderComponent={() => {
            if (modalType !== 'ModalDate') {
              return (
                <View style={styles.headerBotSheet}>
                  <View style={styles.leftHeader} />
                  <View style={styles.centerHeader}>
                    <AppText value={getTitle()} fontSize={fontSize.f16} fontWeight="semibold" />
                  </View>
                  <TouchableOpacity
                    disabled={modalType === 'ModalFilter'}
                    onPress={() => {
                      appContext.setLoading(false);
                      dispatch(setRefreshingDealAppointment(true));
                      bottomSheetModalRef.current?.close();
                      if (modalType === 'ModalItem' && selectedAppointment) {
                        setTimeout(() => {
                          changeStatus(selectedAppointment.id);
                        }, setTimeOut());
                      }
                    }}
                    style={styles.rightHeader}>
                    {modalType === 'ModalItem' ? (
                      <AppText value={t('lead:skip').toString()} color={color.mainBlue} fontSize={fontSize.f14} />
                    ) : null}
                  </TouchableOpacity>
                </View>
              );
            }
          }}
          ref={bottomSheetModalRef}>
          {renderModalContent()}
        </Modalize>
      </Portal>
    </View>
  );
};

export default AppointmentTab;
