import AppText from '@components/AppText';
import { MyIcon } from '@components/Icon';
import React, { useEffect, useRef, useState } from 'react';
import { View, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import styles from './styles';
import { SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Input } from 'react-native-elements/dist/input/Input';
import { Tab } from 'react-native-elements';
import Back from 'react-native-vector-icons/AntDesign';
import { responsivePixel, fontSize, color, padding } from '@helpers/index';
import { useNavigation } from '@react-navigation/core';
import { AppRoutes } from '@navigation/appRoutes';
import { apiGet } from '@services/serviceHandle';
import { CallActivityItem } from '@interfaces/contact.interface';
import serviceUrls from '@services/serviceUrls';
import { ScreenHeight } from 'react-native-elements/dist/helpers';
import Toast from 'react-native-toast-message';
import ItemCall from './ItemCall';
import { Modalize } from 'react-native-modalize';
import ModalAudio from '@components/ModalAudio';
import { Host, Portal } from 'react-native-portalize';

export enum CallType {
  Call_Go = 3471,
  Call_Back = 3472,
}

export enum ResultId {
  Call_Finish = 3465,
  Call_Failed = 3520,
}
export enum TypeDetails {
  DetailsLead = 3,
  DetailsContact = 5,
  DetailsInterprise = 2,
  DetailsDeal = 1,
}
export enum urlPlay { }
export interface CallTypeProps {
  callType: CallType;
  resultId: ResultId;
}
const CallHistory = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [isRefresh, setIsRefresh] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const bottomSheetModalRef = useRef<Modalize>(null);
  const [urlAudio, setUrlAudio] = useState<string>('');

  const [index, setIndex] = useState(0);
  const [data, setData] = useState<CallActivityItem[]>([]);

  const callActivity = async () => {
    try {
      const body = {
        skipCount: page,
        maxResultCount: 20,
        isMissedCall: index === 1,
        isOnlyMobile: true,
      };
      const response = await apiGet(serviceUrls.path.historyCall, body);
      if (!response.error) {
        if (page === 1) {
          setTotalCount(response.response.data.totalCount);
          setData(response.response.data.items);
        } else {
          setTotalCount(response.response.data.totalCount);
          setData([...data, ...response.response.data.items]);
        }
      } else {
        Toast.show({
          type: 'error',
          text1: t('lead:notice'),
          text2: response.errorMessage || response.detail || '',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('lead:notice'),
        text2: JSON.stringify(error),
      });
    } finally {
      setIsLoadMore(false);
      setIsRefresh(false);
    }
  };
  useEffect(() => {
    callActivity();
  }, [page]);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
      return;
    }
    callActivity();
  }, [index]);

  const renderFooter = () => {
    return isLoadMore ? (
      <View>
        <ActivityIndicator size="large" color={color.grayShaft} />
      </View>
    ) : null;
  };
  const handelLoadMore = () => {
    if (data.length >= totalCount) {
      setIsLoadMore(false);
    } else {
      setPage(page + 1);
      setIsLoadMore(true);
    }
  };

  const openAudio = (url: string) => {
    setUrlAudio(url);
    bottomSheetModalRef.current?.open();
  };

  const renderNoData = () => {
    return !isLoadMore ? (
      <View style={{ height: ScreenHeight * 0.5, alignItems: 'center', justifyContent: 'center' }}>
        <AppText>{t('title:no_data')}</AppText>
      </View>
    ) : null;
  };

  return (
    <Host>
      <SafeAreaView style={{ paddingTop: padding.p16, backgroundColor: color.white, flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={styles.back}>
            <Back name="left" size={fontSize.f24} color={color.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate(AppRoutes.SEARCH_PHONE);
            }}
            activeOpacity={0.8}
            style={styles.input}>
            <Input
              editable={false}
              onPressIn={() => navigation.navigate(AppRoutes.SEARCH_PHONE)}
              inputStyle={{ minHeight: responsivePixel(32) }}
              leftIconContainerStyle={{ marginVertical: 0, height: responsivePixel(28) }}
              style={{ fontSize: fontSize.f12, paddingVertical: 0 }}
              inputContainerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
              placeholderTextColor={color.subText}
              placeholder={t('input:input_call_history')}
              renderErrorMessage={false}
              leftIcon={<MyIcon.IconSearch size={13} color={color.icon} />}
            />
          </TouchableOpacity>
        </View>
        <Tab
          value={index}
          onChange={(data) => {
            if (index !== data) {
              setIndex(data);
              setIsRefresh(true);
            }
          }}
          indicatorStyle={{ backgroundColor: color.primary }}>
          <Tab.Item
            title={t('label:all')}
            titleStyle={[styles.textAllMissed, { color: index === 0 ? color.primary : color.subText }]}
            buttonStyle={{ backgroundColor: color.white }}
          />
          <Tab.Item
            title={t('label:missed')}
            titleStyle={[styles.textAllMissed, { color: index === 0 ? color.subText : color.primary }]}
            buttonStyle={{ backgroundColor: color.white }}
          />
        </Tab>
        <View style={{ backgroundColor: color.lightGray }}>
          <AppText style={styles.textCall}>{t('label:textCall')}</AppText>
        </View>

        <FlatList
          style={{ flex: 1 }}
          data={data}
          extraData={data}
          keyExtractor={(item, index) => item?.activityId?.toString() || index.toString()}
          renderItem={({ item }) => <ItemCall playAudio={() => openAudio(item.urlAudio)} item={item} />}
          refreshing={isRefresh}
          onRefresh={() => {
            setIsRefresh(true);
            if (page !== 1) {
              setPage(1);
            } else {
              callActivity();
            }
          }}
          ListEmptyComponent={renderNoData}
          ListFooterComponent={renderFooter}
          onEndReached={handelLoadMore}
          onEndReachedThreshold={0.5}
        />
        <Portal>
          <Modalize adjustToContentHeight ref={bottomSheetModalRef}>
            {!!urlAudio && <ModalAudio urlAudio={urlAudio || ''} />}
          </Modalize>
        </Portal>
      </SafeAreaView>
    </Host>
  );
};
export default CallHistory;
