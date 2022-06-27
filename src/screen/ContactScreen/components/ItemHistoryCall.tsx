import React, { FC, useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { color, fontSize, padding } from '@helpers/index';
import { AppText } from '@components/index';
import { useTranslation } from 'react-i18next';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import dayjs from 'dayjs';
import {
  DATE_FORMAT,
  HOURS_MINUTE_FORMAT,
  TIME_FORMAT_24,
  TOTAL_SECOND_IN_HOURS,
  TOTAL_SECOND_IN_MINUTE,
} from '@helpers/constants';
import Sound from 'react-native-sound';
export enum callStatus {
  callStatus_1,
  callStatus_2,
  callStatus_3,
}
export interface CallProps {
  startTime: Date | string;
  creationTime: Date | string;
  endTime: Date | string;
  callType: number;
  status: string;
  // callDay: string;
  callTime: Date | string;
  // callStatus: callStatus;
  urlAudio: string;
  playIcon: () => void;
}

const ItemHistoryCall: FC<CallProps> = React.memo(
  ({
    startTime,
    creationTime,
    endTime,
    callType,
    status,
    // callDay,
    callTime,
    urlAudio,
    playIcon,
  }) => {
    const { t } = useTranslation();
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

    const resultTimeCall = (countTimeCall: number) => {
      if (countTimeCall > TOTAL_SECOND_IN_HOURS) {
        return t('translation:dateTimeCallFormat', {
          hours: Math.floor(countTimeCall / TOTAL_SECOND_IN_HOURS).toString(),
          minute: Math.floor((countTimeCall % TOTAL_SECOND_IN_HOURS) / TOTAL_SECOND_IN_MINUTE).toString(),
          seconds: Math.floor(countTimeCall % TOTAL_SECOND_IN_MINUTE).toString(),
        });
      }
      if (countTimeCall > TOTAL_SECOND_IN_MINUTE) {
        return `${Math.floor(countTimeCall / TOTAL_SECOND_IN_MINUTE)} ${t('title:minutes')} ${Math.floor(
          countTimeCall % TOTAL_SECOND_IN_MINUTE,
        )} ${t('title:second')}`;
      }
      return `${Math.floor(countTimeCall)} ${t('title:second')}`;
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
      <View style={styles.formListCall}>
        <AppText style={styles.stylesDay}>{renderFormatDate(callTime)}</AppText>
        <View style={styles.itemHistoryCall}>
          <TouchableOpacity>
            <View style={{ flexDirection: 'row' }}>
              <AppText style={styles.textTime}>{dayjs(callTime).format(TIME_FORMAT_24).toString()}</AppText>
              <AppText style={styles.textTitle} fontWeight="semibold">
                {status}
              </AppText>
            </View>
            <AppText style={styles.textSecond}>{resultTimeCall(durationTime)}</AppText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => playIcon()}>
            <Icon name="play" type="antdesign" color={color.primary} size={18} />
          </TouchableOpacity>
        </View>
      </View>
    );
  },
);
const styles = StyleSheet.create({
  formListCall: {
    paddingHorizontal: padding.p16,
  },
  stylesDay: {
    marginBottom: padding.p2,
    lineHeight: padding.p18,
    fontSize: fontSize.f14,
  },
  textTime: {
    fontSize: fontSize.f12,
    lineHeight: padding.p18,
  },
  textTitle: {
    lineHeight: padding.p18,
    fontSize: fontSize.f12,
    marginLeft: padding.p24,
  },
  textSecond: {
    paddingLeft: padding.p66,
    color: color.grey,
    fontSize: fontSize.f12,
    lineHeight: padding.p18,
  },
  itemHistoryCall: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: padding.p9,
    borderBottomWidth: 1,
    borderBottomColor: color.centerborder,
    marginBottom: padding.p9,
  },
});
export default ItemHistoryCall;
