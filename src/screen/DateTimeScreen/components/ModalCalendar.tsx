import { DATE_FORMAT_EN } from '@helpers/constants';
import { color } from '@helpers/index';
import dayjs from 'dayjs';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarList } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from './Header';

export interface ModalCalendarProps {
  onClose: () => void;
  type: number | null | undefined;
  onChangeDate: (startTime: string, endTime: string, type: number) => void;
  typeStart?: boolean;
  onSaveData: (value: object) => void;
  setIdCheck: (id: number) => void;
  setTypeCheck: (type: number) => void;
}

const ModalCalendar: FC<ModalCalendarProps> = React.memo((props) => {
  const { onClose, type, onChangeDate, typeStart, onSaveData, setIdCheck, setTypeCheck } = props;
  const { t } = useTranslation();

  const [selectDay, setSelectDay] = useState(dayjs(new Date()).format(DATE_FORMAT_EN));
  const startWeek = dayjs(selectDay).startOf('week');
  const endWeek = dayjs(selectDay).endOf('week');
  const dataWeek = (date: Date | string) => {
    let data = {};
    for (let i = 0; i <= 6; i++) {
      const newDate = startWeek.add(i, 'day').format(DATE_FORMAT_EN);

      data = {
        ...data,
        [newDate]: {
          selected: true,
          color: color.primary,
          startingDay: i === 0 ? true : false,
          endingDay: i === 6 ? true : false,
        },
      };
    }
    return data;
  };

  const renderMarkedDates = (type: number | null | undefined) => {
    switch (type) {
      case 1:
        return {
          [selectDay]: { selected: true, selectedColor: color.primary, startingDay: true },
        };
      case 2:
        return dataWeek(selectDay);
      case 99:
        if (typeStart) {
          return {
            [selectDay]: { selected: true, color: color.primary, startingDay: true },
          };
        } else {
          return {
            [selectDay]: { selected: true, color: color.primary, endingDay: true },
          };
        }
      default:
        break;
    }
  };
  const title = () => {
    switch (type) {
      case 1:
        return t('business:selectDay');
      case 2:
        return t('business:selectWeek');
      case 99:
        return t('business:option');
      default:
        return '';
    }
  };
  const onCheck = (type: number | null | undefined) => {
    switch (type) {
      case 1:
        onChangeDate(selectDay, selectDay, type);
        onSaveData({ id: 3, label: t('business:option'), value: selectDay, type });
        setIdCheck(3);
        setTypeCheck(type);
        onClose();
        break;
      case 2:
        onChangeDate(startWeek.format(DATE_FORMAT_EN), endWeek.format(DATE_FORMAT_EN), type);
        onSaveData({ id: 4, label: t('business:lastWeek'), valueStart: startWeek, valueEnd: endWeek, type });
        setIdCheck(4);
        setTypeCheck(type);
        onClose();
        break;
      case 99:
        onChangeDate(selectDay, selectDay, type);
        onClose();
        break;

      default:
        break;
    }
  };

  return (
    <SafeAreaView>
      <AppHeader title={title()} onPressLeft={onClose} onPressRight={() => onCheck(type)} />
      <CalendarList
        onVisibleMonthsChange={(months) => {}}
        pastScrollRange={50}
        futureScrollRange={50}
        firstDay={1}
        scrollEnabled={true}
        showScrollIndicator={true}
        onDayPress={(day) => setSelectDay(day.dateString)}
        markingType={type === 1 ? 'multi-period' : 'period'}
        markedDates={renderMarkedDates(type)}
      />
    </SafeAreaView>
  );
});

export default ModalCalendar;
