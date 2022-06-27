import styles from './styles';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FlatList, Modal, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/reducers';
import { detailsLeadInteractiveRequest, setRefreshingLeadInteractive } from '@redux/actions/detailsActions';
import { ItemInteractive } from '@components/Item/Details/index';
import { SelectButton, AppEmptyViewList, ModalDate, AppText, AppConfirm } from '@components/index';
import dayjs from 'dayjs';
import { DATE_FORMAT, DATE_FORMAT_EN, ModalizeDetailsType } from '@helpers/constants';
import { color, fontSize } from '@helpers/index';
import { ItemDetailsInteractive } from '@interfaces/lead.interface';
import { Modalize } from 'react-native-modalize';
import InteractiveBottomSheet from '@components/Details/InteractiveBottomSheet';
import { AppContext } from '@contexts/index';
import serviceUrls from '@services/serviceUrls';
import { ResponseReturn } from '@interfaces/response.interface';
import { apiDelete } from '@services/serviceHandle';
import Toast from 'react-native-toast-message';
import { Portal } from 'react-native-portalize';
import { setTimeOut } from '@helpers/untils';
import ModalAudio from '@components/ModalAudio';
interface IInteractiveTab {}

const InteractiveTab = (props: IInteractiveTab) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const appContext = useContext(AppContext);
  const { objInteractive, leadId } = useSelector((state: RootState) => state.detailsLeadReducer);
  const bottomSheetModalRef = useRef<Modalize>();
  const [modalType, setModalType] = useState<'ModalDate' | 'ModalFilter' | 'ModalItem' | 'ModalAudio'>('ModalDate');
  const [selectedInteractive, setSelectedInteractive] = useState<ItemDetailsInteractive | null>(null);
  const [openModalConfirmInteractive, setOpenModalConfirmInteractive] = useState(false);
  const [idFilter, setIdFilter] = useState(-99);
  const [dateFilter, setDateFilter] = useState(dayjs().format(DATE_FORMAT_EN).toString());
  const [audioData, setUrlAudio] = useState<ItemDetailsInteractive | null>(null);

  useEffect(() => {
    if (objInteractive.load.isRefreshing) {
      dispatch(detailsLeadInteractiveRequest(leadId ?? '', true, dateFilter));
    }
  }, [objInteractive.load.isRefreshing, leadId]);
  const arrFilter = [
    {
      id: -99,
      name: t('lead:all_interactive'),
      type: null,
    },
    {
      id: 1,
      name: t('lead:call_phone'),
      type: 'call',
    },
    {
      id: 2,
      name: t('lead:send_mail'),
      type: 'email',
    },
    {
      id: 3,
      name: 'SMS',
      type: 'sms',
    },
  ];
  arrFilter.sort((a, b) => {
    return a.id - b.id;
  });

  const deleteInteractive = async (id: string | number) => {
    try {
      appContext.setLoading(true);
      const url = `${serviceUrls.path.calllog}${id}`;
      const response: ResponseReturn<boolean> = await apiDelete(url, {});
      console.log();
      if (response.error) {
        appContext.setLoading(false);
        Toast.show({
          type: 'error',
          text1: t('lead:notice'),
          text2: response.errorMessage || response.detail || '',
        });
      } else {
        Toast.show({
          type: 'success',
          text1: t('lead:notice'),
          text2: t('lead:delete_interactive_success'),
        });
        dispatch(setRefreshingLeadInteractive(true));
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

  const getListInteractive = () => {
    try {
      const findIndexCurrent = arrFilter.findIndex((x) => x.id === idFilter);
      const obj = findIndexCurrent > -1 ? arrFilter[findIndexCurrent] : null;
      const arrData = objInteractive.arrInteractive;
      let arrFilterData: ItemDetailsInteractive[] = [];
      if (obj) {
        if (obj.id === -99) {
          arrFilterData = arrData;
        } else {
          if (obj.type === 'call') {
            arrFilterData = arrData.filter((x) => x.activityCallHistoryId !== null);
          } else if (obj.type === 'email') {
            arrFilterData = arrData.filter((x) => x.settingEmailId !== null);
          } else if (obj.type === 'sms') {
            arrFilterData = arrData.filter((x) => x.smsHistoryId !== null);
          }
        }
      } else {
        arrFilterData = arrData;
      }
      return arrFilterData;
    } catch (error) {
      return objInteractive.arrInteractive;
    }
  };

  let obj: { id: number; name: string; type: string | null } = {
    id: -99,
    name: t('lead:all_interactive'),
    type: null,
  };
  const findIndex = arrFilter.findIndex((x) => x.id === idFilter);
  if (findIndex > -1) {
    obj = arrFilter[findIndex];
  }

  const openModal = (type: 'ModalDate' | 'ModalFilter' | 'ModalItem') => {
    setModalType(type);
    bottomSheetModalRef.current?.open();
  };

  const renderModalContent = () => {
    switch (modalType) {
      case 'ModalAudio':
        return <ModalAudio title={audioData?.callTypeAsString || ''} urlAudio={audioData?.urlAudio || ''} />;
      case 'ModalDate':
        return (
          <ModalDate
            handleConfirm={(date) => {
              setDateFilter(dayjs(date).format(DATE_FORMAT_EN).toString());
              setTimeout(() => {
                dispatch(setRefreshingLeadInteractive(true));
              }, setTimeOut());
            }}
            handleCancel={() => bottomSheetModalRef.current?.close()}
            date={dayjs(dateFilter).toDate()}
            titleCalendar={t('business:selectDay')}
          />
        );
      case 'ModalItem':
        return (
          <InteractiveBottomSheet
            type={ModalizeDetailsType.item}
            onPress={() => {
              setOpenModalConfirmInteractive(true);
              bottomSheetModalRef.current?.close();
            }}
          />
        );
      case 'ModalFilter':
        return (
          <InteractiveBottomSheet
            type={ModalizeDetailsType.filter}
            onPress={(id?: number) => {
              if (id) {
                setIdFilter(id);
              }
              bottomSheetModalRef.current?.close();
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
        refreshing={objInteractive.load.isRefreshing}
        onRefresh={() => dispatch(setRefreshingLeadInteractive(true))}
        data={getListInteractive()}
        extraData={getListInteractive()}
        keyExtractor={(item, index) => item.id}
        renderItem={({ item, index }) => (
          <ItemInteractive
            onPlay={() => {
              setUrlAudio(item);
              setModalType('ModalAudio');
              setTimeout(() => {
                bottomSheetModalRef.current?.open();
              }, 200);
            }}
            item={item}
            onPress={() => {
              setSelectedInteractive(item);
              openModal('ModalItem');
            }}
          />
        )}
        ListEmptyComponent={() => {
          return (
            <AppEmptyViewList
              isRefreshing={objInteractive.load.isRefreshing}
              isErrorData={objInteractive.load.isError}
              onReloadData={() => dispatch(setRefreshingLeadInteractive(true))}
            />
          );
        }}
      />
      <Modal visible={openModalConfirmInteractive} transparent animationType="fade">
        <AppConfirm
          title={t('lead:delete_interactive')}
          content={`${t('lead:confirm_delete_interactive_quest')}`}
          subContent={`${selectedInteractive && selectedInteractive.content ? selectedInteractive.content : ''}?`}
          colorSubContent={color.black}
          onPressLeft={() => setOpenModalConfirmInteractive(false)}
          onPressRight={() => {
            setOpenModalConfirmInteractive(false);
            if (selectedInteractive && selectedInteractive.activityCallHistoryId) {
              setTimeout(() => {
                deleteInteractive(selectedInteractive.activityCallHistoryId);
              }, setTimeOut());
            }
          }}
        />
      </Modal>
      <Portal>
        <Modalize
          adjustToContentHeight
          HeaderComponent={() => {
            if (modalType === 'ModalFilter') {
              return (
                <View style={styles.headerBotSheet}>
                  <View style={styles.centerHeader}>
                    <AppText
                      value={t('lead:interactive_select').toString()}
                      fontSize={fontSize.f16}
                      fontWeight="semibold"
                    />
                  </View>
                </View>
              );
            }
            return null;
          }}
          ref={bottomSheetModalRef}>
          {renderModalContent()}
        </Modalize>
      </Portal>
    </View>
  );
};

export default InteractiveTab;
