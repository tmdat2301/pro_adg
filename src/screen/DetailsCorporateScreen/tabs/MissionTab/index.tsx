import styles from './styles';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FlatList, Modal, TouchableOpacity, View } from 'react-native';
import { color, fontSize } from '@helpers/index';
import { RootState } from '@redux/reducers';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { detailsCorporateMissionRequest, setRefreshingCorporateMission } from '@redux/actions/detailsActions';
import { ItemMission } from '@components/Item/Details/index';
import { SelectButton, AppEmptyViewList, ModalDate, AppText } from '@components/index';
import { ResponseReturn } from '@interfaces/response.interface';
import serviceUrls from '@services/serviceUrls';
import { apiPut } from '@services/serviceHandle';
import { ItemTask, ItemResultMission } from '@interfaces/lead.interface';
import dayjs from 'dayjs';
import AppConfirm from '@components/AppConfirm';
import { AppContext } from '@contexts/index';
import { DATE_FORMAT, DATE_FORMAT_EN, ISO_DATES, ModalizeDetailsType, TypeFieldExtension } from '@helpers/constants';
import { Modalize } from 'react-native-modalize';
import { BodyTask } from '@interfaces/params.interface';
import MissionBottomSheet from '@components/Details/MissionBottomSheet';
import { Portal } from 'react-native-portalize';
import { setTimeOut } from '@helpers/untils';
import Toast from 'react-native-toast-message';
interface IMissionTab {}

const MissionTab = (props: IMissionTab) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const appContext = useContext(AppContext);
  const { objMission, corporateId } = useSelector((state: RootState) => state.detailsCorporateReducer);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [selectedMission, setSelectedMission] = useState<ItemTask | null>(null);
  const [modalType, setModalType] = useState<'ModalDate' | 'ModalFilter' | 'ModalItem' | 'ModalChangeTime'>(
    'ModalDate',
  );
  const bottomSheetModalRef = useRef<Modalize>();
  const [dateFilter, setDateFilter] = useState(dayjs().format(DATE_FORMAT_EN).toString());
  const [idFilter, setIdFilter] = useState(-99);
  useEffect(() => {
    if (objMission.load.isRefreshing) {
      dispatch(detailsCorporateMissionRequest(corporateId ?? '', dateFilter, idFilter));
    }
  }, [objMission.load.isRefreshing, corporateId]);
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

  const getTitle = () => {
    switch (modalType) {
      case 'ModalChangeTime':
        return '';
      case 'ModalFilter':
        return t('lead:status_select').toString();
      case 'ModalDate':
        return '';
      case 'ModalItem':
        return t('lead:result_select').toString();
    }
  };

  const changeStatus = async (id: number | string) => {
    try {
      const url = `${serviceUrls.path.changeStatusCorporateTask}${id}?status=true`;
      appContext.setLoading(true);
      const response: ResponseReturn<boolean> = await apiPut(url, {});
      if (response.error) {
        appContext.setLoading(false);
        Toast.show({
          type: 'error',
          text1: t('lead:notice'),
          text2: response.errorMessage || response.detail || '',
        });
        return;
      }
      if (response.response && response.response.data) {
        appContext.setLoading(false);
        Toast.show({
          type: 'success',
          text1: t('lead:notice'),
          text2: t('lead:completed_mission'),
        });
        setTimeout(() => {
          dispatch(setRefreshingCorporateMission(true));
        }, setTimeOut());
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
  const updateResult = async (result: ItemResultMission) => {
    try {
      appContext.setLoading(true);
      const url = serviceUrls.path.changeResultTask;
      let obj: BodyTask | null = null;
      if (selectedMission) {
        obj = {
          id: selectedMission.id,
          result: result.label,
          type: 1,
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
        if (selectedMission) {
          changeStatus(selectedMission.id);
        }
      }
    } catch (error) {
      appContext.setLoading(false);
      Toast.show({
        type: 'error',
        text1: t('lead:notice'),
        text2: JSON.stringify(error),
      });
    } finally {
      appContext.setLoading(false);
    }
  };

  const changeTimeTask = async (date: string) => {
    try {
      if (selectedMission) {
        appContext.setLoading(true);
        const url = serviceUrls.path.changeTimeTask;
        const response: ResponseReturn<boolean> = await apiPut(url, {
          type: 1,
          id: selectedMission.id,
          duration: date,
        });
        if (response.error) {
          appContext.setLoading(false);
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
            text2: t('lead:change_time_success'),
          });
          setSelectedMission(null);
          setTimeout(() => {
            dispatch(setRefreshingCorporateMission(true));
          }, setTimeOut());
        }
      } else {
      }
    } catch (error) {
    } finally {
      appContext.setLoading(false);
    }
  };

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

  const openModal = (type: 'ModalDate' | 'ModalFilter' | 'ModalItem' | 'ModalChangeTime') => {
    setModalType(type);
    bottomSheetModalRef.current?.open();
  };

  const renderModalContent = () => {
    switch (modalType) {
      case 'ModalDate':
        return (
          <ModalDate
            handleConfirm={(date) => {
              setDateFilter(dayjs(date).format(DATE_FORMAT_EN).toString());
              setTimeout(() => {
                dispatch(setRefreshingCorporateMission(true));
              }, setTimeOut());
            }}
            handleCancel={() => bottomSheetModalRef.current?.close()}
            date={dayjs(dateFilter).toDate()}
            titleCalendar={t('business:selectDay')}
          />
        );
      case 'ModalChangeTime':
        return (
          <ModalDate
            mode="datetime"
            handleConfirm={(date) => {
              changeTimeTask(dayjs(date).format(ISO_DATES));
            }}
            handleCancel={() => bottomSheetModalRef.current?.close()}
            date={dayjs(dateFilter).toDate()}
            titleCalendar={t('business:selectDay')}
          />
        );
      case 'ModalFilter':
        return (
          <MissionBottomSheet
            type={ModalizeDetailsType.filter}
            onPress={(id: number | null) => {
              bottomSheetModalRef.current?.close();
              if (id) {
                setIdFilter(id);
                setTimeout(() => {
                  dispatch(setRefreshingCorporateMission(true));
                }, setTimeOut());
              }
            }}
          />
        );
      case 'ModalItem':
        return (
          <MissionBottomSheet
            type={ModalizeDetailsType.item}
            onPress={(id: number | null, result?: ItemResultMission) => {
              bottomSheetModalRef.current?.close();
              if (result) {
                updateResult(result);
              }
            }}
          />
        );
      default:
        return null;
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.viewFilter}>
        <SelectButton
          titleStyle={styles.filterText}
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
          titleStyle={styles.filterText}
          themeColor={color.subText}
          onPress={() => {
            openModal('ModalFilter');
          }}
          title={obj.name}
        />
      </View>
      <FlatList
        refreshing={objMission.load.isRefreshing}
        onRefresh={() => {
          dispatch(setRefreshingCorporateMission(true));
        }}
        data={objMission.arrMission}
        extraData={objMission.arrMission}
        keyExtractor={(item, index) => item.id}
        renderItem={({ item, index }) => (
          <ItemMission
            type={TypeFieldExtension.lead}
            item={item}
            onPress={() => {
              setOpenModalConfirm(true);
              setSelectedMission(item);
            }}
            onPressChange={() => {
              setSelectedMission(item);
              openModal('ModalChangeTime');
            }}
          />
        )}
        ItemSeparatorComponent={() => {
          return <View style={styles.lineSepe} />;
        }}
        ListEmptyComponent={() => {
          return (
            <AppEmptyViewList
              isRefreshing={objMission.load.isRefreshing}
              isErrorData={objMission.load.isError}
              onReloadData={() => dispatch(setRefreshingCorporateMission(true))}
            />
          );
        }}
      />
      <Portal>
        <Modalize
          adjustToContentHeight
          HeaderComponent={() => {
            if (modalType !== 'ModalDate' && modalType !== 'ModalChangeTime') {
              return (
                <View style={styles.headerBotSheet}>
                  <View style={styles.leftHeader} />
                  <View style={styles.centerHeader}>
                    <AppText value={getTitle()} fontSize={fontSize.f16} fontWeight="semibold" />
                  </View>
                  <TouchableOpacity
                    disabled={modalType === 'ModalFilter'}
                    onPress={() => {
                      bottomSheetModalRef.current?.close();
                      if (selectedMission) {
                        setTimeout(() => {
                          changeStatus(selectedMission.id);
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

      <Modal visible={openModalConfirm} transparent animationType="fade">
        <AppConfirm
          title={t('lead:update_status')}
          content={`${t('lead:mission_confirm')}`}
          onPressLeft={() => setOpenModalConfirm(false)}
          onPressRight={() => {
            setOpenModalConfirm(false);
            if (selectedMission) {
              changeStatus(selectedMission.id);
            }
          }}
        />
      </Modal>
    </View>
  );
};

export default MissionTab;
