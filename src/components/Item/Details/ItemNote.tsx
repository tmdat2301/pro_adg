import { ItemDetailsNote } from '@interfaces/lead.interface';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { color, padding, fontSize } from '@helpers/index';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import AppText from '@components/AppText';
import { DATE_FORMAT } from '@helpers/constants';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
interface IItemNote {
  item: ItemDetailsNote;
  onPress: (id: number | string) => void;
  onOption: () => void;
}

const ItemNote = (props: IItemNote) => {
  const { t } = useTranslation();
  const { id, content, creationName, lastModificationTime } = props.item;
  const convertTime = () => {
    try {
      const dateNow = dayjs(Date.now());
      if (lastModificationTime) {
        const durationHour = dateNow.diff(lastModificationTime, 'hour');
        if (durationHour < 1) {
          const durationMinute = dateNow.diff(lastModificationTime, 'minute');
          if (durationMinute === 1) {
            return `1 ${t('lead:minute_ago')}`;
          }
          if (durationMinute < 1) {
            return ` ${t('lead:seconds_ago')}`;
          }
          return `${durationMinute} ${t('lead:minutes_ago')}`;
        }
        if (durationHour === 1) {
          return t('lead:an_hour_ago');
        }
        if (durationHour > 1 && durationHour < 24) {
          return `${durationHour} ${t('lead:hours_ago')}`;
        }
        return dayjs(lastModificationTime).format(DATE_FORMAT);
      }
    } catch (error) {
      return '';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        <View style={styles.iconFileType}>
          <Icon type="antdesign" name="filetext1" size={fontSize.f20} color={color.icon} />
        </View>
        <TouchableOpacity activeOpacity={1} onPress={() => props.onPress(id)} style={styles.contentFile}>
          <AppText value={content} fontSize={fontSize.f14} numberOfLines={2} />
          <View style={styles.contentOwned}>
            <AppText value={creationName} fontSize={fontSize.f12} color={color.subText} />
            <Icon
              type="simple-line-icon"
              name="clock"
              size={fontSize.f10}
              color={color.icon}
              style={styles.iconClock}
            />
            <AppText value={convertTime()} fontSize={fontSize.f12} color={color.subText} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} style={styles.iconOptions} onPress={() => props.onOption()}>
          <Icon type="entypo" name="dots-three-vertical" size={fontSize.f14} color={color.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.lineSepe} />
    </View>
  );
};

export default ItemNote;

const styles = StyleSheet.create({
  container: {
    width: ScreenWidth,
    paddingHorizontal: padding.p16,
    backgroundColor: color.white,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxHeight: ScreenWidth * 0.2,
  },
  lineSepe: {
    width: '100%',
    height: 1,
    backgroundColor: color.hawkesBlue,
  },
  contentFile: {
    flex: 1,
    padding: padding.p12,
  },

  iconFileType: {
    width: 20,
    alignItems: 'center',
  },
  iconOptions: {
    width: 15,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconClock: {
    marginHorizontal: padding.p8,
  },
  contentOwned: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
