import AppText from '@components/AppText';
import { DATE_TIME_FORMAT, TaskType, TypeFieldExtension } from '@helpers/constants';
import { padding, color, fontSize } from '@helpers/index';
import { ItemTask } from '@interfaces/lead.interface';
import { AppRoutes } from '@navigation/appRoutes';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import { Icon } from 'react-native-elements/dist/icons/Icon';
interface IItemMission {
  item: ItemTask;
  onPress: () => void;
  onPressChange?: () => void;
  type: TypeFieldExtension;
}

const ItemMission = (props: IItemMission) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { duration, completed, title, description, type, finishDay, id, resultName } = props.item;
  const isExpiredTime = dayjs(Date.now()).diff(dayjs(duration), 'minute') > 0 ? true : false;
  const setNameByType = () => {
    switch (type) {
      case TaskType.callPhone:
        return t('lead:call_phone');
      case TaskType.sendEmail:
        return t('lead:send_mail');
      case TaskType.callPrice:
        return t('lead:call_price');
      default:
        return t('lead:call_phone');
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
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
            value={
              completed
                ? `${t('lead:completed_time')}: ${dayjs(finishDay).format(DATE_TIME_FORMAT)}`
                : `${t('lead:expired_time')}: ${dayjs(duration).format(DATE_TIME_FORMAT)}`
            }
            fontSize={fontSize.f12}
            color={completed ? color.subText : color.orange}
            style={styles.mh8}
          />
        </View>
        {description ? (
          <View style={styles.itemContainer}>
            <AppText fontSize={fontSize.f12} fontWeight="semibold">
              {`${t('lead:description')}: `}
              <AppText value={description} fontSize={fontSize.f12} />
            </AppText>
          </View>
        ) : null}
        {resultName ? (
          <AppText fontSize={fontSize.f12} numberOfLines={2} fontWeight="medium">
            {`${t('lead:result')}: `}
            <AppText value={resultName} fontWeight="normal" />
          </AppText>
        ) : null}
      </TouchableOpacity>

      {completed ? null : (
        <>
          <View style={styles.lineSepe} />
          <View style={styles.itemContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if (props.onPressChange) {
                  props.onPressChange();
                }
              }}
              style={styles.itembtn}>
              <Icon type="simple-line-icon" name="clock" size={fontSize.f14} color={color.icon} />
              <AppText value={t('lead:change_time').toString()} fontSize={fontSize.f14} style={styles.mh10} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                props.onPress();
              }}
              style={styles.itembtn}>
              <Icon type="antdesign" name="checkcircle" size={fontSize.f14} color={color.green900} />
              <AppText
                value={t('lead:complete').toString()}
                fontSize={fontSize.f14}
                color={color.green900}
                style={styles.mh10}
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default ItemMission;

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
