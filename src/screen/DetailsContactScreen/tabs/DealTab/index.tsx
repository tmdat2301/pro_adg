import AppEmptyViewList from '@components/AppEmptyViewList';
import AppText from '@components/AppText';
import { fontSize, color } from '@helpers/index';
import { detailsContactDealRequest, setRefreshingContactDeal } from '@redux/actions/detailsActions';
import { RootState } from '@redux/reducers';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ItemDeal, ItemOptions } from '@components/Item/Details/index';
import styles from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { convertCurrency } from '@helpers/untils';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import SelectButton from '@components/SelectButton';
interface IDealTab {}

const DealTab = (props: IDealTab) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const bottomSheetModalRef = useRef<Modalize>();
  const { objDeal, contactId } = useSelector((state: RootState) => state.detailsContactReducer);
  const [idFilter, setIdFilter] = useState(-99);
  useEffect(() => {
    if (objDeal.load.isRefreshing) {
      dispatch(detailsContactDealRequest(contactId ?? '', idFilter));
    }
  }, [objDeal.load.isRefreshing, contactId, idFilter]);
  let price = 0;
  objDeal.arrDeal.forEach((element) => {
    price = price + element.price;
  });

  const arrFilter = [
    {
      id: -99,
      name: t('lead:all_status'),
    },
    {
      id: 3,
      name: t('lead:un_deal'),
    },
    {
      id: 1,
      name: t('lead:success_deal'),
    },
    {
      id: 2,
      name: t('lead:fail_deal'),
    },
  ];
  let objFilter = { id: -99, name: t('lead:all_status') };
  const index = arrFilter.findIndex((x) => x.id === idFilter);
  if (index > -1) {
    objFilter = arrFilter[index];
  }

  return (
    <View style={styles.container}>
      <View style={styles.viewFilter}>
        <SelectButton
          titleStyle={{ color: color.subText }}
          themeColor={color.subText}
          onPress={() => {
            bottomSheetModalRef.current?.open();
          }}
          title={`${objFilter.name} (${objDeal.arrDeal.length})`}
        />
      </View>
      <FlatList
        refreshing={objDeal.load.isRefreshing}
        onRefresh={() => {
          dispatch(setRefreshingContactDeal(true));
        }}
        ListEmptyComponent={() => {
          return (
            <AppEmptyViewList
              isRefreshing={objDeal.load.isRefreshing}
              isErrorData={objDeal.load.isError}
              onReloadData={() => dispatch(setRefreshingContactDeal(true))}
            />
          );
        }}
        ItemSeparatorComponent={() => {
          return <View style={styles.lineSepe} />;
        }}
        data={objDeal.arrDeal}
        extraData={objDeal.arrDeal}
        keyExtractor={(item, index) => item.id.toString()}
        renderItem={({ item, index }) => <ItemDeal item={item} />}
      />
      <SafeAreaView edges={['bottom']} style={styles.safebottom}>
        <View style={styles.rowSummary}>
          <AppText value={t('lead:summary').toString()} fontSize={fontSize.f12} />
          <AppText
            value={`${convertCurrency(price)}đ`}
            style={{ textAlign: 'right' }}
            color={color.navyBlue}
            fontWeight="semibold"
          />
        </View>
      </SafeAreaView>
      <Portal>
        <Modalize
          adjustToContentHeight
          HeaderComponent={() => {
            return (
              <View style={styles.headerBotSheet}>
                <View style={styles.centerHeader}>
                  <AppText value={t('lead:status_select').toString()} fontSize={fontSize.f16} fontWeight="semibold" />
                </View>
              </View>
            );
          }}
          ref={bottomSheetModalRef}>
          <>
            {arrFilter.map((v, i) => {
              return (
                <ItemOptions
                  key={v.id}
                  value={v.name}
                  onPress={() => {
                    bottomSheetModalRef.current?.close();
                    setIdFilter(v.id);
                    dispatch(setRefreshingContactDeal(true));
                  }}
                />
              );
            })}
          </>
        </Modalize>
      </Portal>
    </View>
  );
};

export default DealTab;
