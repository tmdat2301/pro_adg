import { AppButton, AppText, SelectButton } from '@components/index';
import { AppContext } from '@contexts/index';
import { DATE_FORMAT } from '@helpers/constants';
import { color, fontSize, padding } from '@helpers/index';
import { convertCurrency } from '@helpers/untils';
import { getListTaskRequest } from '@redux/actions/taskAction';
import actionTypes from '@redux/actionTypes';
import { RootState } from '@redux/reducers';
import { apiPost } from '@services/serviceHandle';
import serviceUrls from '@services/serviceUrls';
import dayjs from 'dayjs';
import { Formik } from 'formik';
import { isNull } from 'lodash';
import moment from 'moment';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import FormHead from './components/FormHead';
import FormPayment from './components/FormItem';
import ModalLizePayment from './components/ModalLizePayment';
import styles from './styles';
export interface Item {
  id: number;
  itemMission: string;
  itemName: string;
  itemDate: string;
  itemPrice: number;
  itemNote: string;
}

const PaymentScreen = React.memo(() => {
  const [request, setRequest] = useState<Item[]>([]);
  const hasRequest = request.length > 0;
  const countRequest = request.length;
  const taskReducer = useSelector((state: RootState) => state.listTaskReducers);
  const { t } = useTranslation();
  const appContext = useContext(AppContext);
  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(true);
  const [isLoadmore, setIsLoadMore] = useState(false);
  const [dataTasks, setDataTaks] = useState<any[]>([]);
  const limit = 10;
  const dispatch = useDispatch();
  const bottomSheetModalRef = useRef<Modalize>();
  const formikRef = useRef<any>(null);
  const userReducer = useSelector((state: RootState) => state.userReducer);
  const [modalType, setModalType] = useState<any>();
  const dataSelect = [
    { value: t('label:all'), id: '0', label: t('label:all'), email: null },
    { value: t('title:mission'), id: '1', label: t('title:mission'), email: null },
    { value: t('label:appointment'), id: '2', label: t('label:appointment'), email: null },
  ];
  const [body, setBody] = useState<any>({
    filter: '',
    endTime: dayjs().toDate() ?? new Date(),
    startTime: dayjs().toDate() ?? new Date(),
    type: 0,
  });

  const callRefresh = () => {
    if (page !== 0) {
      setPage(0);
    } else {
      dispatch(
        getListTaskRequest({
          userId: userReducer.userInfo.id, // thông tin người dùng cần tìm kiếm
          page: page,
          filter: body.filter,
          endTime: body.endTime,
          startTime: body.startTime,
          pageSize: limit,
          type: body.type,
        }),
      );
    }
  };
  const callSend = async () => {
    const bodyRequest = request.map((e) => e.id);
    appContext.setLoading(true);
    try {
      const response = await apiPost(serviceUrls.path.sendTask, bodyRequest);
      if (response.error) {
        Toast.show({
          type: 'error',
          text1: 'ERROR',
          text2: response.errorMessage || response.detail || '',
        });
      } else {
        Toast.show({
          type: 'success',
          text1: t('title:success'),
          text2: t('title:create_payment_success'),
        });
        callRefresh();
      }
      appContext.setLoading(false);
    } catch (error) {
      appContext.setLoading(false);
    }
  };
  useEffect(() => {
    dispatch(
      getListTaskRequest({
        userId: userReducer.userInfo.id, // thông tin người dùng cần tìm kiếm
        page: page,
        filter: body.filter,
        endTime: body.endTime,
        startTime: body.startTime,
        pageSize: limit,
        type: body.type,
      }),
    );
  }, [page]);

  useEffect(() => {
    if (taskReducer.type === actionTypes.TASK_FAILED || taskReducer.type === actionTypes.TASK_SUCCESS) {
      if (refreshing) setRefreshing(false);
      if (isLoadmore) setIsLoadMore(false);
      if (taskReducer.type === actionTypes.TASK_SUCCESS) {
        const dataTemp = taskReducer.arrTask.map((e: any) => {
          return {
            id: e.id,
            itemMission: e.title,
            itemName: e.name,
            itemDate: isNull(e.duration)
              ? dayjs(e.beginTime).format(DATE_FORMAT) + '-' + dayjs(e.endTime).format(DATE_FORMAT)
              : dayjs(e.duration).format(DATE_FORMAT),
            itemPrice: e.totalCost,
            itemNote: e.typeName,
          };
        });
        if (page === 0) {
          setDataTaks(dataTemp);
        } else {
          setDataTaks([...dataTasks, ...dataTemp]);
        }
      }
    }
  }, [taskReducer]);

  useEffect(() => {
    setRequest([]);
  }, [dataTasks]);

  useEffect(() => {
    callRefresh();
  }, [body])

  const renderItem = (data: { item: any; index: number }) => {
    const { item } = data;
    const isRequest = request.findIndex((itemRequest: Item) => itemRequest.id == item.id) != -1;
    return (
      <TouchableOpacity disabled style={{ backgroundColor: color.white, marginBottom: padding.p8 }}>
        <FormPayment
          onPressBox={() => {
            setRequest((prev: Item[]) => {
              // const isRequest = request.findIndex((itemRequest: Item) => itemRequest.id == item.id) != -1;
              if (isRequest) {
                return request.filter((itemRequest: Item) => item.id !== itemRequest.id);
              } else {
                return [...prev, item];
              }
            });
          }}
          checked={!isRequest}
          itemMission={item.itemMission}
          itemName={item.itemName}
          itemDate={item.itemDate}
          itemPrice={convertCurrency(item.itemPrice ?? 0)}
          itemNote={item.itemNote}
          itemId={item.id}
        />
      </TouchableOpacity>
    );
  };

  const totalPrice = (array: Item[]) => {
    return array.reduce(function (total, item) {
      return total + item.itemPrice;
    }, 0);
  };

  const handelLoadMore = () => {
    const newDataLength = taskReducer.arrTask.length;
    if (newDataLength === limit && !refreshing && (page + 1) * limit < taskReducer.totalCount) {
      setIsLoadMore(true);
      setPage(page + 1);
      setRefreshing(false);
    }
  };
  const handelRefresh = () => {
    setRefreshing(true);
    callRefresh();
  };

  const FormPaymentBottom = () => {
    return (
      <View style={[styles.bodyFooter, { paddingBottom: useSafeAreaInsets().bottom }]}>
        <View style={styles.formCosts}>
          <AppText style={styles.textTotalConst}>{t('title:all_cost')}</AppText>
          <AppText fontWeight="semibold" style={styles.textTotalAmount}>
            {convertCurrency(totalPrice(request))}
          </AppText>
        </View>
        <AppButton
          title={`${t('button:create_payment_request')} (${countRequest})`}
          titleStyle={{ fontSize: fontSize.f14 }}
          onPress={() => {
            callSend();
          }}
        />
      </View>
    );
  };
  const renderFooter = () => {
    if (isLoadmore) {
      return (
        <View style={styles.containLoadmore}>
          <View style={[styles.loadmore]}>
            <ActivityIndicator size="small" color="black" />
          </View>
        </View>
      );
    } else {
      return null;
    }
  };
  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <Formik
        initialValues={{
          filter: '',
          endTime: dayjs().toDate() ?? new Date(),
          startTime: dayjs().toDate() ?? new Date(),
          type: '0',
        }}
        innerRef={formikRef}
        onSubmit={(values) => {
          setBody({ ...values });
          setRefreshing(true);
          // callRefresh();
        }}>
        {({ values }) => (
          <>
            <FormHead />
            <View style={styles.formDate}>
              <SelectButton
                title={moment(values.startTime).format('DD/MM/YY') + '-' + moment(values.endTime).format('DD/MM/YY')}
                titleStyle={{ color: color.icon }}
                themeColor={color.icon}
                onPress={() => {
                  setModalType('DateFrom');
                  bottomSheetModalRef.current?.open();
                }}
              />
              <SelectButton
                title={dataSelect.filter((e) => e.id + '' === values.type + '')?.[0]?.value || ''}
                titleStyle={{ color: color.icon }}
                themeColor={color.icon}
                onPress={() => {
                  setModalType('TypeFilter');
                  bottomSheetModalRef.current?.open();
                }}
              />
            </View>
            <ModalLizePayment
              typeModal={modalType}
              bottomSheetModalRef={bottomSheetModalRef}
              setModalType={setModalType}
            />
          </>
        )}
      </Formik>
      <FlatList
        style={{ backgroundColor: color.lightGray }}
        showsVerticalScrollIndicator={false}
        data={dataTasks}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: hasRequest ? 100 : 0 + useSafeAreaInsets().bottom }}
        onEndReached={handelLoadMore}
        onRefresh={handelRefresh}
        refreshing={refreshing}
        onEndReachedThreshold={0}
        ListFooterComponent={renderFooter}
      />
      {hasRequest && <FormPaymentBottom />}
    </SafeAreaView>
  );
});
export default PaymentScreen;
