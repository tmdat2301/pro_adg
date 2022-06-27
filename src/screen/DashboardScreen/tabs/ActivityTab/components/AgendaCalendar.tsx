import React, { FC, memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, ActivityIndicator, Alert, FlatList } from 'react-native';
import { color, fontSize, padding } from '@helpers/index';
import AppText from '@components/AppText';
import { isIOS, ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import ActivityItem from './ActivityItem';
import { ItemListTask } from '@interfaces/dashboard.interface';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/reducers';
import { setTimeOut } from '@helpers/untils';
import { DATE_FORMAT_EN, TypeCriteria, TypeFieldExtension } from '@helpers/constants';
import AppConfirm from '@components/AppConfirm';
import Geolocation from 'react-native-geolocation-service';
import Toast from 'react-native-toast-message';
import { AppContext } from '@contexts/index';
import serviceUrls from '@services/serviceUrls';
import { ResponseReturn, ResponseReturnArray } from '@interfaces/response.interface';
import { BodyTaskCheck, ResultLocation } from '@interfaces/task.interface';
import { apiGet, apiPost, apiPut } from '@services/serviceHandle';
import env from '@config/env';
import { Linking } from 'react-native';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Modalize } from 'react-native-modalize';
import { ItemResultMission } from '@interfaces/lead.interface';
import { ItemOptions } from '@components/Item/Details';
import { BodyTask } from '@interfaces/params.interface';
import { Portal } from 'react-native-portalize';
import SwiperView from '@screen/DashboardScreen/components/SwiperView';
import BoxListActivity from './BoxListActivity';
import ContactWithCustomers from './ContactWithCustomers';
import HeaderListActivity from './HeaderCalendar';
import { getListTaskRequest, reportTaskRequest, taskSummaryRequest } from '@redux/actions/businessActions';
import actionTypes from '@redux/actionTypes';
import userReducer from '@redux/reducers/userReducer';
require('dayjs/locale/vi');

export interface AgendaCalendarProps {
  isFocused: boolean;
}
const AgendaCalendar: FC<AgendaCalendarProps> = (props) => {
  const { isFocused } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isRefreshing, pageListTask, totalCountTask, arrListTask, type } = useSelector(
    (state: RootState) => state.activityReducer,
  );
  const { filterActivity } = useSelector((state: RootState) => state.filterReducer);
  const [isComplete, setIsComplete] = useState(false);
  const [openModalConfirmTask, setOpenModalConfirmTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ItemListTask | null>(null);
  const [checkingLocation, setCheckingLocation] = useState<BodyTaskCheck>({
    id: '',
    latitude: 0,
    longtitude: 0,
    place: '',
    placeId: '',
  });
  const bottomSheetModalRef = useRef<Modalize>();
  const [arrResult, setArrResult] = useState<ItemResultMission[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const appContext = useContext(AppContext);
  const focused = useRef(false);
  const [currentDate, setCurrentDate] = useState(dayjs(filterActivity.startTime).toDate());
  const { mapInfo } = useSelector((state: RootState) => state.userReducer);
  const lastIndex = arrListTask.length - 1;

  const onRefresh = useCallback(
    (date: string) => {
      setRefreshing(true);
      dispatch(reportTaskRequest(filterActivity));
      dispatch(taskSummaryRequest(filterActivity));
      dispatch(
        getListTaskRequest({
          date: date,
          filterType: filterActivity.userId ? 1 : 2,
          organizationUnitId: filterActivity.organizationUnitId,
          userId: filterActivity.userId,
          page: 1,
          pageSize: 10,
          type: 0,
        }),
      );
    },
    [filterActivity],
  );

  const onRefreshList = useCallback(
    (date: string) => {
      setRefreshing(true);
      dispatch(
        getListTaskRequest({
          date: date,
          filterType: filterActivity.userId ? 1 : 2,
          organizationUnitId: filterActivity.organizationUnitId,
          userId: filterActivity.userId,
          page: 1,
          pageSize: 10,
          type: 0,
        }),
      );
    },
    [filterActivity],
  );

  useEffect(() => {
    if (isFocused === false) {
      return;
    }
    if (focused.current === false && isFocused === true) {
      focused.current = true;
    }
    if (filterActivity.organizationUnitId && focused.current === true) {
      onRefresh(filterActivity.startTime);
    }
  }, [isFocused, filterActivity]);

  useEffect(() => {
    if (arrResult.length === 0) {
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
      getResultMission();
    }
  }, []);

  useEffect(() => {
    if (type === actionTypes.LIST_TASK_DATE_FAILED || type === actionTypes.LIST_TASK_DATE_SUCCESS) {
      setRefreshing(false);
    }
  }, [type]);

  const renderHeader = useMemo(() => {
    return (
      <>
        <SwiperView firstComponent={<BoxListActivity />} secondComponent={<ContactWithCustomers />} />
        <HeaderListActivity
          refreshing={refreshing}
          currentDate={currentDate}
          setCurrentDate={(date) => {
            setCurrentDate(date);
            onRefreshList(dayjs(date).format(DATE_FORMAT_EN).toString());
          }}
        />
      </>
    );
  }, [currentDate, refreshing]);

  const getRootType = (root: string | number) => {
    switch (root) {
      case TypeCriteria.lead:
        return TypeFieldExtension.lead;
      case TypeCriteria.deal:
        return TypeFieldExtension.deal;
      case TypeCriteria.corporate:
        return TypeFieldExtension.corporate;
      case TypeCriteria.contact:
        return TypeFieldExtension.contact;
      default:
        return TypeFieldExtension.lead;
    }
  };

  const contentConfirm = () => {
    let content = t('input:done_confirm') + '?';
    if (selectedTask) {
      if (!isComplete || (selectedTask && isComplete && !selectedTask.isCheckOut && selectedTask.isCheckIn)) {
        content = checkingLocation.place;
      }
    }
    return content;
  };
  const titleConfirm = () => {
    let title = t('lead:confirm');
    if (selectedTask) {
      if (isComplete) {
        if (selectedTask.isCheckOut || (!selectedTask.isCheckIn && !selectedTask.isCheckOut)) {
          title = t('lead:confirm');
        } else {
          title = t('lead:confirm_checkOut_before');
        }
      } else {
        if (selectedTask.isCheckIn) {
          title = t('lead:confirm_check_out');
        } else {
          title = t('lead:confirm_check_in');
        }
      }
    }
    return title;
  };

  const openModalConfirm = (isCompleted: boolean, item: ItemListTask, isClickCompleted: boolean) => {
    setSelectedTask(item);
    setIsComplete(isClickCompleted);
    if (isCompleted) {
      setOpenModalConfirmTask(true);
    } else {
      requestPermissionLocation();
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
        Toast.show({
          type: 'error',
          text1: t('lead:notice'),
          text2: response.errorMessage || response.detail || 'Lỗi không lấy được vị trí',
        });
        return;
      }
      if (response.response && response.response.results && response.response.results.length > 0) {
        const result1 = response.response.results[0];
        setTimeout(() => {
          setCheckingLocation({
            id: '',
            latitude: result1.geometry.location.lat,
            longtitude: result1.geometry.location.lng,
            place: result1.formatted_address || '',
            placeId: result1.place_id,
          });
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
      if (selectedTask) {
        if (
          (selectedTask.isCheckIn && selectedTask.isCheckOut) ||
          (!selectedTask.isCheckIn && !selectedTask.isCheckOut && isComplete)
        ) {
          bottomSheetModalRef.current?.open();
        } else {
          const body: BodyTaskCheck = {
            id: selectedTask?.id ?? '',
            latitude: checkingLocation.latitude,
            longtitude: checkingLocation.longtitude,
            placeId: checkingLocation.placeId,
            place: checkingLocation.place,
          };
          appContext.setLoading(true);
          const url =
            selectedTask && selectedTask.isCheckIn === true ? serviceUrls.path.checkOut : serviceUrls.path.checkIn;
          const response: ResponseReturn<boolean> = await apiPost(url, body);
          if (response.error) {
            Toast.show({
              type: 'error',
              text1: t('lead:notice'),
              text2: response.errorMessage || response.detail || '',
            });
            return;
          }
          if (response.response && response.response.data) {
            Toast.show({
              type: 'success',
              text1: t('lead:notice'),
              text2: t(selectedTask && selectedTask.isCheckIn ? 'label:checkOutSuccess' : 'label:checkInSuccess'),
            });
            if (selectedTask.isCheckIn) {
              bottomSheetModalRef.current?.open();
            }
            dispatch(
              getListTaskRequest({
                date: dayjs(currentDate).format(DATE_FORMAT_EN).toString(),
                filterType: filterActivity.userId ? 1 : 2,
                organizationUnitId: filterActivity.organizationUnitId,
                userId: filterActivity.userId,
                page: 1,
                pageSize: 10,
                type: 0,
              }),
            );
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

  const updateResult = async (resultId: number) => {
    try {
      appContext.setLoading(true);
      const url = serviceUrls.path.changeResultTask;
      let obj: BodyTask | null = null;
      if (selectedTask) {
        obj = {
          id: selectedTask.id,
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
        if (selectedTask) {
          changeStatus(selectedTask.id, selectedTask.root);
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
  const handelLoadMore = () => {
    const newDataLength = arrListTask.length;
    if (newDataLength < totalCountTask) {
      dispatch(
        getListTaskRequest({
          date: dayjs(currentDate).format(DATE_FORMAT_EN).toString(),
          filterType: filterActivity.userId ? 1 : 2,
          organizationUnitId: filterActivity.organizationUnitId,
          userId: filterActivity.userId,
          page: pageListTask + 1,
          pageSize: 10,
          type: 0,
        }),
      );
    }
  };

  const changeStatus = async (id: number | string, root: number | string) => {
    try {
      const url = `${serviceUrls.path.changeStatus.replace('{type}', getRootType(root))}${id}?status=true`;
      appContext.setLoading(true);
      const response: ResponseReturn<boolean> = await apiPut(url, {});
      if (response.error) {
        Toast.show({
          type: 'error',
          text1: t('lead:notice'),
          text2: response.errorMessage || response.detail || '',
        });
        return;
      }
      if (response.response && response.response.data) {
        Toast.show({
          type: 'success',
          text1: t('title:notice'),
          text2: t('title:update_mission'),
        });
        setTimeout(() => {
          dispatch(
            getListTaskRequest({
              date: dayjs(currentDate).format(DATE_FORMAT_EN).toString(),
              filterType: filterActivity.userId ? 1 : 2,
              organizationUnitId: filterActivity.organizationUnitId,
              userId: filterActivity.userId,
              page: 1,
              pageSize: 10,
              type: 0,
            }),
          );
        }, setTimeOut());
      }
    } catch (error) {
    } finally {
      appContext.setLoading(false);
    }
  };
  const renderListActivity = (data: { item: ItemListTask; index: number }) => {
    const { item, index } = data;
    const isLastItem = lastIndex === index;
    return (
      <ActivityItem
        isLast={isLastItem}
        key={item.id}
        pressCheck={() => {
          openModalConfirm(item.isCheckIn, item, false);
        }}
        pressCompleted={() => {
          if ((!item.isCheckIn && !item.isCheckOut) || item.isCheckOut) {
            openModalConfirm(true, item, true);
          } else {
            if (item.isCheckIn && item.isCheckOut) {
              openModalConfirm(true, item, true);
            } else {
              openModalConfirm(item.isCheckOut, item, true);
            }
          }
        }}
        item={item}
      />
    );
  };
  const renderFooter = () => {
    return refreshing ? (
      <View style={{ flex: 1, backgroundColor: color.white, padding: padding.p16, minHeight: ScreenHeight / 2 }}>
        <ActivityIndicator size={'large'} color={color.navyBlue} />
      </View>
    ) : null;
  };
  return (
    <>
      <FlatList
        showsVerticalScrollIndicator={false}
        onRefresh={() => onRefresh(dayjs(currentDate).format(DATE_FORMAT_EN).toString())}
        ListHeaderComponent={renderHeader}
        refreshing={refreshing}
        keyExtractor={(item, index) => (item.id.toString() + index.toString()).toString()}
        style={styles.contentContainer}
        contentContainerStyle={styles.listContainer}
        data={arrListTask}
        ListEmptyComponent={
          !refreshing ? (
            <View style={styles.emptyData}>
              <AppText fontSize={fontSize.f12} color={color.subText}>
                {t('title:no_data')}
              </AppText>
            </View>
          ) : undefined
        }
        maxToRenderPerBatch={10}
        extraData={arrListTask.length}
        renderItem={renderListActivity}
        ListFooterComponent={renderFooter}
        onEndReached={handelLoadMore}
        initialNumToRender={6}
        onEndReachedThreshold={0.5}
        updateCellsBatchingPeriod={500}
      />

      <Modal visible={openModalConfirmTask} transparent animationType="fade">
        <AppConfirm
          title={titleConfirm()}
          content={contentConfirm()}
          onPressLeft={() => setOpenModalConfirmTask(false)}
          onPressRight={() => {
            setOpenModalConfirmTask(false);
            setTimeout(() => {
              if (
                isComplete ||
                (selectedTask && selectedTask.isCheckIn && selectedTask.isCheckOut) ||
                (selectedTask && selectedTask.isCheckIn && !selectedTask.isCheckOut)
              ) {
                bottomSheetModalRef.current?.open();
              } else {
                checkInCheckOut();
              }
            }, setTimeOut());
          }}
          textBtnRight={selectedTask && selectedTask.isCheckIn && isComplete ? 'Check-out' : t('lead:confirm')}
        />
      </Modal>
      <Portal>
        <Modalize
          adjustToContentHeight
          withReactModal={isIOS}
          HeaderComponent={() => {
            return (
              <View style={styles.headerBotSheet}>
                <View style={styles.leftHeader} />
                <View style={styles.centerHeader}>
                  <AppText value={t('lead:result_select').toString()} fontSize={fontSize.f16} fontWeight="semibold" />
                </View>
                <TouchableOpacity
                  onPress={() => {
                    appContext.setLoading(false);
                    bottomSheetModalRef.current?.close();
                    setTimeout(() => {
                      selectedTask && changeStatus(selectedTask.id, selectedTask.root);
                    }, setTimeOut());
                  }}
                  style={styles.rightHeader}>
                  <AppText value={t('lead:skip').toString()} color={color.mainBlue} fontSize={fontSize.f14} />
                </TouchableOpacity>
              </View>
            );
          }}
          ref={bottomSheetModalRef}>
          <>
            {arrResult.map((v) => {
              return (
                <ItemOptions
                  key={v.label}
                  value={v.value}
                  onPress={() => {
                    updateResult(v.label);
                    bottomSheetModalRef.current?.close();
                  }}
                />
              );
            })}
          </>
        </Modalize>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    marginBottom: padding.p16,
    borderBottomEndRadius: 8,
    paddingBottom: padding.p16,
    flex: 1,
  },
  listContainer: {
    marginBottom: padding.p16,
  },
  containerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: padding.p8,
    paddingBottom: padding.p4,
    alignItems: 'center',
    borderBottomColor: color.lightGrayBorder,
    borderBottomWidth: 1,
  },
  headerItem: {
    alignItems: 'center',
    paddingHorizontal: padding.p12,
    paddingVertical: padding.p4,
    borderRadius: 4,
  },
  activeHeader: {
    backgroundColor: color.primary,
  },
  headerBotSheet: {
    width: ScreenWidth,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftHeader: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightHeader: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerHeader: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  emptyData: {
    height: 50,
    backgroundColor: color.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomEndRadius: 8,
    borderBottomStartRadius: 8,
    paddingBottom: 8,
  },
});

export default memo(AgendaCalendar);
