import { CallActivityItem } from '@interfaces/contact.interface';
import styles from './styles';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import AppText from '@components/AppText';
import { color, padding, responsivePixel } from '@helpers/index';
import dayjs from 'dayjs';
import Toast from 'react-native-toast-message';
import SoundPlayer from 'react-native-sound-player';
import { AppRoutes } from '@navigation/appRoutes';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { ResultId, TypeDetails, CallType } from './index';
import { MyIcon } from '@components/Icon';
import { DATE_FORMAT, HOURS_MINUTE_FORMAT } from '@helpers/constants';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

export interface CallItemProps {
  item: CallActivityItem;
  playAudio: () => void;
}

export default React.memo((props: CallItemProps) => {
  const { item, playAudio } = props;
  const { t } = useTranslation();
  const navigation = useNavigation();

  const onCall = (item: CallActivityItem) => {
    if (item.phone) {
      const phone = item.phone.replace('+', '');
      const phoneShow = item.phone;
      navigation.navigate(AppRoutes.CALL, { name: item.name, phone: phone, phoneShow: phoneShow });
    }
  };
  const changeDetail = (key: TypeDetails, idNumber: number) => {
    switch (key) {
      case TypeDetails.DetailsLead:
        navigation.navigate(AppRoutes.DETAIL_LEAD, { key: idNumber, isGoback: true });
        break;
      case TypeDetails.DetailsContact:
        navigation.navigate(AppRoutes.DETAIL_CONTACT, { key: idNumber, isGoback: true });
        break;
      case TypeDetails.DetailsInterprise:
        navigation.navigate(AppRoutes.DETAIL_CORPORATE, { key: idNumber, isGoback: true });
        break;
      case TypeDetails.DetailsDeal:
        navigation.navigate(AppRoutes.DETAIL_DEAL, { key: idNumber, isGoback: true });
    }
  };
  const renderPlayUrl = (item: CallActivityItem) => {
    if (item.resultId !== ResultId.Call_Failed) {
      return (
        <TouchableOpacity hitSlop={{ top: 16, left: 16, right: 16, bottom: 16 }} onPress={playAudio}>
          <AntDesign name={'play'} color={color.navyBlue} size={16} />
        </TouchableOpacity>
      );
    }
  };

  const renderCallType = (from: CallType, type: ResultId) => {
    if (from === CallType.Call_Go) {
      if (type === ResultId.Call_Finish) {
        return <MyIcon.ArrowReceivedCall />;
      } else {
        if (type === ResultId.Call_Failed) {
          return <MyIcon.ArrowMissedCall />;
        }
      }
    }
    if (from === CallType.Call_Back) {
      if (type === ResultId.Call_Finish) {
        return <MyIcon.ArrowCalled />;
      } else {
        if (type === ResultId.Call_Failed) {
          return <MyIcon.ArrowMissedCallaway />;
        }
      }
    }
  };

  const renderFormatDate = (time: Date | string) => {
    let times = dayjs(time).format(HOURS_MINUTE_FORMAT).toString();
    let dayofWeek = '';

    if (dayjs(time).isSame(Date.now(), 'day')) {
      return t('title:today').toString();
    } else if (dayjs(time).add(1, 'day').isSame(Date.now(), 'day')) {
      return t('title:yesterday').toString();
    } else if (dayjs(time).add(-1, 'day').isSame(Date.now(), 'day')) {
      return t('title:tomorrow').toString();
    } else {
      if (dayjs().isBefore(dayjs(time).add(7, 'day'))) {
        switch (dayjs(time).day()) {
          case 0:
            dayofWeek = t('label:sunday');
            break;
          case 1:
            dayofWeek = t('label:monday');
            break;
          case 2:
            dayofWeek = t('label:tuesday');
            break;
          case 3:
            dayofWeek = t('label:wednesday');
            break;
          case 4:
            dayofWeek = t('label:thursday');
            break;
          case 5:
            dayofWeek = t('label:friday');
            break;
          case 6:
            dayofWeek = t('label:saturday');
            break;
        }
        times = dayofWeek;
      } else {
        times = dayjs(time).format(DATE_FORMAT).toString();
      }
    }
    return times;
  };
  return (
    <View key={item.id}>
      <TouchableOpacity style={styles.container} onPress={() => onCall(item)}>
        <View style={styles.iconCallstatus}>{renderCallType(item.callType, item.resultId)}</View>
        <View style={styles.viewItem}>
          <View style={{ flex: 1 }}>
            <View>
              <AppText numberOfLines={2} style={styles.textName}>
                {item.name}
              </AppText>
              <AppText numberOfLines={1} style={styles.textPhone}>
                {item.phone}
              </AppText>
            </View>
          </View>
          <View
            style={{
              width: responsivePixel(82),
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            <View style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
              <AppText numberOfLines={1} style={styles.textTime}>
                {renderFormatDate(item.creationTime)}
              </AppText>
              {!!item.urlAudio && renderPlayUrl(item)}
            </View>

            <TouchableOpacity
              style={{ marginHorizontal: padding.p6 }}
              onPress={() => {
                changeDetail(item.type, item.id);
              }}>
              <Icon name="md-information-circle-outline" color={color.primary} size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.borderBottom} />
    </View>
  );
});
