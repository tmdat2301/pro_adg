import AppText from '@components/AppText';
import AppPlayer from '@components/ModalAudio/AppPlayer';
import { DATE_FORMAT } from '@helpers/constants';
import { padding, color, fontSize } from '@helpers/index';
import { ItemDetailsInteractive } from '@interfaces/lead.interface';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import Sound from 'react-native-sound';
interface IItemInteractive {
  item: ItemDetailsInteractive;
  onPress: () => void;
  onPlay: () => void;
}

const ItemInteractive = (props: IItemInteractive) => {
  const { t } = useTranslation();
  const { urlAudio, creatorName, content, creationTime, settingEmailId, smsHistoryId, activityCallHistoryId, title } =
    props.item;
  const sound = useRef<Sound | null>(null);
  const [durationTime, setDuration] = useState(0);

  useEffect(() => {
    if (urlAudio) {
      const filepath = urlAudio;
      sound.current = new Sound(filepath, undefined, (error) => {
        if (!error) {
          setDuration(sound.current?.getDuration() || 0);
        }
      });
    }
    return () => {
      if (sound.current !== null) {
        sound.current.release();
        sound.current = null;
      }
    };
  }, []);

  const renderIcon = () => {
    if (activityCallHistoryId) {
      return <Icon type="antdesign" name="phone" color={color.icon} size={fontSize.f18} />;
    }
    if (smsHistoryId) {
      return <Icon type="antdesign" name="message1" color={color.icon} size={fontSize.f20} />;
    }
    if (settingEmailId) {
      return <Icon type="antdesign" name="mail" color={color.icon} size={fontSize.f20} />;
    }
    return <Icon type="antdesign" name="phone" color={color.icon} size={fontSize.f18} />;
  };
  const convertTime = () => {
    try {
      const dateNow = dayjs(Date.now());
      const durationHour = dateNow.diff(creationTime, 'hour');
      if (durationHour < 1) {
        const durationMinute = dateNow.diff(creationTime, 'minute');
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
      return dayjs(creationTime).format(DATE_FORMAT);
    } catch (error) {
      return dayjs(creationTime).format(DATE_FORMAT);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        <View style={styles.iconFileType}>{renderIcon()}</View>
        <View style={styles.contentCenter}>
          <View style={styles.lineContent}>
            <AppText
              value={creatorName || t('label:emptyName').toString()}
              fontSize={fontSize.f14}
              fontWeight="semibold"
            />
            <Icon
              type="simple-line-icon"
              name="clock"
              size={fontSize.f10}
              color={color.icon}
              style={styles.iconClock}
            />
            <AppText value={convertTime()} fontSize={fontSize.f12} color={color.subText} />
          </View>
          {urlAudio && durationTime > 0 ? (
            <View style={styles.lineContent}>
              <AppText value={t('lead:record').toString()} color={color.subText} />
              <TouchableOpacity
                style={{ marginHorizontal: padding.p6, flexDirection: 'row', alignItems: 'center' }}
                activeOpacity={0.8}
                hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
                onPress={() => props.onPlay()}>
                <Icon type="antdesign" name={'play'} color={color.navyBlue} size={16} />
                <View
                  style={{
                    width: 90,
                    height: 5,
                    borderRadius: 8,
                    backgroundColor: color.gray,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginHorizontal: padding.p4,
                  }}>
                  <View style={{ width: 88, height: 3, backgroundColor: color.navyBlue }} />
                </View>
              </TouchableOpacity>
              <AppText fontSize={fontSize.f10} color={color.subText}>{`${AppPlayer.secondsToHHMMSS(
                durationTime,
              )}`}</AppText>
            </View>
          ) : title ? (
            <AppText value={t('lead:title').toString()} fontSize={fontSize.f12} fontWeight="semibold">
              <AppText value={title} fontSize={fontSize.f12} fontWeight="normal" />
            </AppText>
          ) : null}

          <View style={styles.lineContent}>
            {activityCallHistoryId ? (
              <View style={styles.lineContent}>
                <AppText fontSize={fontSize.f12} fontWeight="semibold">
                  {`${t('lead:note')}: `}
                  <AppText value={content} fontSize={fontSize.f12} fontWeight="normal" />
                </AppText>
              </View>
            ) : (
              <View style={styles.lineContent}>
                <AppText fontSize={fontSize.f12} fontWeight="semibold" numberOfLines={1}>
                  {`${t('lead:content')}: `}:
                  <AppText value={content} fontSize={fontSize.f12} fontWeight="normal" />
                </AppText>
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            props.onPress();
          }}
          style={styles.iconOptions}>
          <Icon type="entypo" name="dots-three-vertical" size={fontSize.f14} color={color.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.lineSepe} />
    </View>
  );
};

export default ItemInteractive;

const styles = StyleSheet.create({
  container: {
    width: ScreenWidth - 32,
    marginHorizontal: padding.p16,
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
  iconFileType: {
    width: 20,
    alignItems: 'center',
  },
  iconOptions: {
    width: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconClock: {
    marginHorizontal: padding.p8,
  },
  contentCenter: {
    flex: 1,
    paddingVertical: padding.p10,
    paddingHorizontal: padding.p16,
  },
  lineContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
