import styles from './styles';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, View } from 'react-native';
import { SelectButton, AppEmptyViewList, ModalDate, AppText } from '@components/index';
import { color, fontSize } from '@helpers/index';
import { DATE_FORMAT, DATE_FORMAT_EN, ModalizeDetailsType } from '@helpers/constants';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '@redux/reducers';
import { detailsDealActivityRequest, setRefreshingDealActivity } from '@redux/actions/detailsActions';
import * as filterActions from '@redux/actions/filterActions';
import { ItemActivity } from '@components/Item/Details/index';
import { ItemActivityType } from '@interfaces/dashboard.interface';
import { Modalize } from 'react-native-modalize';
import ActivityBottomSheet from '@components/Details/ActivityBottomSheet';
import { Portal } from 'react-native-portalize';
import { setTimeOut } from '@helpers/untils';
interface IActivityTab {}

const ActivityTab = (props: IActivityTab) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { objActivity, dealId } = useSelector((state: RootState) => state.detailsDealReducer);
  const { arrTypeActivity, arrTypeActivityNumber } = useSelector((state: RootState) => state.filterReducer);
  const [modalType, setModalType] = useState<'ModalDate' | 'ModalFilter'>('ModalDate');
  const bottomSheetModalRef = useRef<Modalize>();

  const arrFilter = arrTypeActivity.concat({ icon: '', id: -99, name: t('lead:all_activity'), order: -99 });
  arrFilter.sort((a, b) => {
    return a.id - b.id;
  });
  const [dateFilter, setDateFilter] = useState(dayjs().format(DATE_FORMAT_EN).toString());
  const [idFilter, setIdFilter] = useState(-99);
  useEffect(() => {
    if (objActivity.load.isRefreshing) {
      if (idFilter === -99) {
        dispatch(detailsDealActivityRequest(dealId ?? '', arrTypeActivityNumber, 100, dateFilter));
      } else {
        const arrFilter = arrTypeActivityNumber.filter((x) => x === idFilter);
        dispatch(detailsDealActivityRequest(dealId ?? '', arrFilter, 100, dateFilter));
      }
    }
    if (arrTypeActivity.length === 0 || arrTypeActivityNumber.length === 0) {
      dispatch(filterActions.activityTypeRequest());
    }
  }, [objActivity.load.isRefreshing, arrTypeActivity]);
  let obj: ItemActivityType = {
    icon: '',
    id: -99,
    name: t('lead:all_activity'),
    order: -99,
  };
  const findIndex = arrFilter.findIndex((x) => x.id === idFilter);
  if (findIndex > -1) {
    obj = arrFilter[findIndex];
  }

  const openModal = (type: 'ModalDate' | 'ModalFilter') => {
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
                dispatch(setRefreshingDealActivity(true));
              }, setTimeOut());
            }}
            handleCancel={() => bottomSheetModalRef.current?.close()}
            date={dayjs(dateFilter).toDate()}
            titleCalendar={t('business:selectDay')}
          />
        );
      case 'ModalFilter':
        return (
          <ActivityBottomSheet
            onPress={(id: number) => {
              setIdFilter(id);
              bottomSheetModalRef.current?.close();
              setTimeout(() => {
                dispatch(setRefreshingDealActivity(true));
              }, setTimeOut());
            }}
            type={ModalizeDetailsType.filter}
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
        refreshing={objActivity.load.isRefreshing}
        onRefresh={() => dispatch(setRefreshingDealActivity(true))}
        data={objActivity.arrActivity}
        extraData={objActivity.arrActivity}
        keyExtractor={(item, index) => item.id.toString()}
        renderItem={({ item, index }) => <ItemActivity item={item} />}
        ListEmptyComponent={() => {
          return (
            <AppEmptyViewList
              isRefreshing={objActivity.load.isRefreshing}
              isErrorData={objActivity.load.isError}
              onReloadData={() => dispatch(setRefreshingDealActivity(true))}
            />
          );
        }}
      />
      <Portal>
        <Modalize
          adjustToContentHeight
          HeaderComponent={() => {
            if (modalType === 'ModalFilter') {
              return (
                <View style={styles.headerBotSheet}>
                  <View style={styles.centerHeader}>
                    <AppText
                      value={t('lead:activity_select').toString()}
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

export default ActivityTab;
