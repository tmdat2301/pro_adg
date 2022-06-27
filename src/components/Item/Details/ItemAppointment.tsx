import { AppText } from '@components/index';
import { DATE_TIME_FORMAT, TaskType, TypeFieldExtension } from '@helpers/constants';
import { padding, color, fontSize } from '@helpers/index';
import { ItemLocates, ItemTask } from '@interfaces/lead.interface';
import { AppRoutes } from '@navigation/appRoutes';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import { Icon } from 'react-native-elements/dist/icons/Icon';

interface IItemAppointment {
  item: ItemTask;
  onPress: () => void;
  checkInCheckOut: () => void;
  type: TypeFieldExtension;
}

const ItemAppointment = (props: IItemAppointment) => {
  const {
    completed,
    title,
    beginTime,
    endTime,
    type,
    finishDay,
    id,
    isCheckIn,
    isCheckOut,
    place,
    locates,
    resultName,
  } = props.item;
  const { t } = useTranslation();
  const navigation = useNavigation();
  const isExpiredTime = dayjs(Date.now()).diff(dayjs(endTime), 'minute') > 0 ? true : false;
  let locatesCheckIn: ItemLocates | null = null;
  let locatesCheckOut: ItemLocates | null = null;
  let totalTime: string | null = null;
  const findCheckIn = locates.findIndex((x) => x.type === 1);
  const findCheckOut = locates.findIndex((x) => x.type === 2);
  locatesCheckIn = findCheckIn > -1 ? locates[findCheckIn] : null;
  locatesCheckOut = findCheckOut > -1 ? locates[findCheckOut] : null;
  if (locatesCheckIn && locatesCheckOut) {
    const durationMin = dayjs(locatesCheckOut.creationTime).diff(locatesCheckIn.creationTime, 'minutes');
    const durationHours = dayjs(locatesCheckOut.creationTime).diff(locatesCheckIn.creationTime, 'hours');
    const durationSec = dayjs(locatesCheckOut.creationTime).diff(locatesCheckIn.creationTime, 'seconds');

    totalTime = `${durationHours !== 0 ? `${durationHours} ${t('label:hours')} ` : ''}${
      durationMin !== 0 ? `${durationMin - durationHours * 60} ${t('label:minutes')} ` : ''
    }${durationSec !== 0 ? `${durationSec - durationMin * 60} ${t('title:second')} ` : ''}`;
  }
  const setNameByType = () => {
    switch (type) {
      case TaskType.meetCustomer:
        return t('lead:meet_customer');
      case TaskType.meeting:
        return t('lead:meeting');
      case TaskType.demoProduct:
        return t('lead:demo_product');
      case TaskType.other:
        return t('lead:other');
      default:
        return t('lead:other');
    }
  };

  const getLocation = () => {
    if (!isCheckOut && !isCheckIn) {
      return (
        <View style={styles.itemContainer}>
          <AppText fontSize={fontSize.f12} numberOfLines={2} fontWeight="medium">
            {`${t('lead:place')}: `}
            <AppText value={place || ''} fontWeight="normal" />
          </AppText>
        </View>
      );
    }
    if (!completed && place && !isCheckOut && isCheckIn) {
      return (
        <View style={styles.itemContainer}>
          <AppText fontSize={fontSize.f12} numberOfLines={2} fontWeight="medium">
            {'Check in: '}
            <AppText value={locatesCheckIn?.place || ''} fontWeight="normal" />
          </AppText>
        </View>
      );
    }
    if (isCheckOut) {
      return (
        <>
          <View style={styles.itemCheckContainer}>
            <Icon type="font-awesome" name="location-arrow" size={12} color={color.navyBlue} />
            {locatesCheckOut ? (
              <AppText fontSize={fontSize.f12} style={styles.mh8} fontWeight="medium">
                {'Check out: '}
                <AppText value={locatesCheckOut.place} fontSize={fontSize.f12} fontWeight="normal" />
                {/* <AppText value={place} fontSize={fontSize.f12} fontWeight="normal" /> */}
              </AppText>
            ) : null}
          </View>
          {totalTime ? (
            <AppText fontSize={fontSize.f12} numberOfLines={2} fontWeight="medium">
              {`${t('label:totalTime')}: `}
              <AppText value={totalTime} fontWeight="normal" />
            </AppText>
          ) : null}
          {resultName ? (
            <AppText fontSize={fontSize.f12} numberOfLines={2} fontWeight="medium">
              {`${t('lead:result')}: `}
              <AppText value={resultName} fontWeight="normal" />
            </AppText>
          ) : null}
        </>
      );
    }
    if (isCheckIn) {
      return (
        <View style={styles.itemCheckContainer}>
          <Icon type="font-awesome" name="location-arrow" size={12} color={color.navyBlue} />
          {locatesCheckIn ? (
            <AppText fontSize={fontSize.f12} style={styles.mh8} fontWeight="medium">
              {'Check in: '}
              <AppText value={locatesCheckIn.place} fontSize={fontSize.f12} fontWeight="normal" />
              {/* <AppText value={place} fontSize={fontSize.f12} fontWeight="normal" /> */}
            </AppText>
          ) : null}
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.pv16}
        onPress={() => {
          navigation.navigate(AppRoutes.DETAIL_MEETING, { id, type: props.type });
        }}>
        <View style={[styles.itemContainer, { marginBottom: padding.p4 }]}>
          <AppText fontSize={fontSize.f14} color={isExpiredTime ? color.red : color.black} numberOfLines={2}>
            {title} <AppText value={setNameByType()} fontSize={fontSize.f12} style={styles.mh8} color={color.subText} />
          </AppText>
        </View>
        <View style={[styles.itemContainer, { marginBottom: padding.p4 }]}>
          <Icon
            type="simple-line-icon"
            name="clock"
            size={fontSize.f10}
            color={completed ? color.icon : color.orange}
          />
          <AppText
            value={`${dayjs(beginTime).format(DATE_TIME_FORMAT)} - ${dayjs(completed ? finishDay : endTime).format(
              DATE_TIME_FORMAT,
            )}`}
            fontSize={fontSize.f12}
            color={completed ? color.subText : color.orange}
            style={styles.mh8}
          />
        </View>
        {getLocation()}
      </TouchableOpacity>

      {completed ? null : (
        <>
          <View style={styles.lineSepe} />
          <View style={styles.itemContainer}>
            {isCheckOut && !completed ? null : (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  if (props.checkInCheckOut) {
                    props.checkInCheckOut();
                  }
                }}
                style={styles.itembtn}>
                <Icon type="simple-line-icon" name="clock" size={16} color={color.icon} />
                <AppText value={isCheckIn ? 'Check Out' : 'Check In'} fontSize={fontSize.f14} style={styles.mh10} />
              </TouchableOpacity>
            )}
            {completed ? null : (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  props.onPress();
                }}
                style={styles.itembtn}>
                <Icon type="antdesign" name="checkcircle" size={16} color={color.green900} />
                <AppText
                  value={t('lead:complete').toString()}
                  fontSize={fontSize.f14}
                  color={color.green900}
                  style={styles.mh10}
                />
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
    </View>
  );
};

export default ItemAppointment;

const styles = StyleSheet.create({
  container: {
    width: ScreenWidth,
    paddingHorizontal: padding.p16,
    backgroundColor: color.white,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemCheckContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  lineSepe: {
    width: '100%',
    height: 1,
    backgroundColor: color.hawkesBlue,
  },
  itembtn: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  mh10: {
    marginHorizontal: padding.p10,
    paddingVertical: padding.p12,
  },
  mh8: { marginHorizontal: padding.p8 },
  pv16: {
    paddingVertical: padding.p16,
  },
});
