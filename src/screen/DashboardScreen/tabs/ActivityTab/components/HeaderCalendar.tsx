import React, { FC, useCallback, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { color, fontSize, padding } from '@helpers/index';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/reducers';
import dayjs from 'dayjs';
import { HorizontalDirection, usePanResponder } from '@hooks/usePanResponder';
import { DATE_FORMAT_EN, ISO_DATES } from '@helpers/constants';
import { countTaskRequest, getListTaskRequest } from '@redux/actions/businessActions';
import { AppText } from '@components/index';

export interface HeaderListActivityProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  refreshing: boolean;
}
const rangeDate = 7;

const HeaderListActivity: FC<HeaderListActivityProps> = React.memo((props) => {
  const { currentDate, setCurrentDate, refreshing } = props;
  const { arrCountTask } = useSelector((state: RootState) => state.activityReducer);
  const { filterActivity } = useSelector((state: RootState) => state.filterReducer);
  const [listDate, setListDate] = useState<Date[]>([]);

  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (refreshing === true) {
      dispatch(
        countTaskRequest({
          ...filterActivity,
          startTime: dayjs(listDate[0]).format(ISO_DATES),
          endTime: dayjs(listDate[6]).format(ISO_DATES),
        }),
      );
    }
  }, [refreshing]);

  useEffect(() => {
    setCurrentDate(dayjs(filterActivity.startTime).toDate());
    let day = dayjs(filterActivity.startTime).startOf('weeks');
    const listDay: Date[] = [];
    listDay.push(day.toDate());
    while (listDay.length < rangeDate) {
      day = day.add(1, 'day');
      listDay.push(day.toDate());
    }
    setListDate(listDay);
    dispatch(
      countTaskRequest({
        ...filterActivity,
        startTime: dayjs(listDay[0]).format(ISO_DATES),
        endTime: dayjs(listDay[6]).format(ISO_DATES),
      }),
    );
  }, [filterActivity.startTime]);

  const renderDayName = useCallback((day: number) => {
    switch (day) {
      case 0:
        return t('label:sortNameSunday');
      case 1:
        return t('label:sortNameMonDay');
      case 2:
        return t('label:sortNameTuesday');
      case 3:
        return t('label:sortNameWednesday');
      case 4:
        return t('label:sortNameThursday');
      case 5:
        return t('label:sortNameFriday');
      case 6:
        return t('label:sortNameSaturday');
      default:
        return '';
    }
  }, []);

  const onSwipeHorizontal = (direction: HorizontalDirection) => {
    let day = dayjs(listDate[0])
      .add(direction === 'LEFT' ? 1 : -1, 'weeks')
      .startOf('weeks');
    const listDay: Date[] = [];
    listDay.push(day.toDate());
    while (listDay.length < rangeDate) {
      day = day.add(1, 'day');
      listDay.push(day.toDate());
    }
    setListDate(listDay);
    dispatch(
      countTaskRequest({
        ...filterActivity,
        startTime: dayjs(listDay[0]).format(ISO_DATES),
        endTime: dayjs(listDay[6]).format(ISO_DATES),
      }),
    );
  };

  const panResponder = usePanResponder({ onSwipeHorizontal });

  return (
    <View style={styles.container}>
      <AppText fontWeight="semibold" fontSize={fontSize.f14}>
        {dayjs(listDate[3]).format(t('translation:monthYearFormat'))}
      </AppText>
      <View style={styles.containerHeader} {...panResponder.panHandlers}>
        {listDate?.map((item, index) => {
          const isSameDate = dayjs(currentDate).isSame(item, 'date');
          const isToday = dayjs(item).isSame(new Date(), 'date');
          const hasData = arrCountTask.findIndex((x) => dayjs(x.date).isSame(item, 'date'));
          return (
            <TouchableOpacity
              key={index.toString()}
              onPress={() => {
                if (isSameDate) {
                  return;
                }
                setCurrentDate(dayjs(item).toDate());
                dispatch(
                  getListTaskRequest({
                    date: dayjs(item).format(DATE_FORMAT_EN).toString(),
                    filterType: filterActivity.userId ? 1 : 2,
                    organizationUnitId: filterActivity.organizationUnitId,
                    userId: filterActivity.userId,
                    page: 1,
                    pageSize: 20,
                    type: 0,
                  }),
                );
              }}
              style={[styles.headerItem, isSameDate && styles.activeHeader]}>
              {isToday ? (
                <>
                  <AppText style={[styles.textDay, { color: isSameDate ? color.white : color.primary }]}>
                    {renderDayName(dayjs(item).day())}
                  </AppText>
                  <AppText style={[styles.textDate, { color: isSameDate ? color.white : color.primary }]}>
                    {dayjs(item.toString()).date()}
                  </AppText>
                </>
              ) : (
                <>
                  <AppText style={[styles.textDay, isSameDate && { color: color.white }]}>
                    {renderDayName(dayjs(item).day())}
                  </AppText>
                  <AppText style={[styles.textDate, isSameDate && { color: color.white }]}>
                    {dayjs(item.toString()).date()}
                  </AppText>
                </>
              )}
              <View style={[styles.dot, hasData < 0 && { backgroundColor: 'transparent' }]} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.white,
    marginTop: 16,
    padding: 8,
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
  },
  containerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: padding.p8,
    paddingBottom: padding.p4,
    alignItems: 'center',
    borderBottomColor: color.lightGrayBorder,
    borderBottomWidth: 1,
  },
  headerItem: {
    alignItems: 'center',
    paddingHorizontal: padding.p12,
    paddingVertical: padding.p4,
    borderRadius: 4,
  },
  activeHeader: {
    backgroundColor: color.primary,
  },
  textDay: {
    color: color.subText,
    fontSize: fontSize.f14,
  },
  textDate: {
    color: color.subText,
    fontSize: fontSize.f14,
  },
  dot: {
    backgroundColor: color.primary300,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

export default HeaderListActivity;
