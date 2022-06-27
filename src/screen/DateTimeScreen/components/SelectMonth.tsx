import dayjs from 'dayjs';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import RenderItem from './RenderItem';

export interface SelectMonthProps {
  type: number;
  onSaveData: (value: object) => void;
  idCheck: number | undefined;
  setIdCheck: (id: number) => void;
  typeCheck: number | null | undefined;
  setTypeCheck: (type: number) => void;
}

const SelectMonth: FC<SelectMonthProps> = React.memo((props) => {
  const { type, onSaveData, idCheck, setIdCheck, typeCheck, setTypeCheck } = props;
  const { t } = useTranslation();

  const today = new Date();
  const last30Days = new Date(today);
  last30Days.setDate(last30Days.getDate() - 30);

  const startMonth = dayjs().startOf('month').toDate();
  const endMonth = dayjs().endOf('month').toDate();

  const startLastMonth = dayjs(last30Days).startOf('month').toDate();
  const endLastMonth = dayjs(last30Days).endOf('month').toDate();

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 30);

  const dataMonth = [
    { id: 1, label: t('business:30DaysAgo'), valueStart: last30Days, valueEnd: today, type },
    { id: 2, label: t('business:thisMonth'), valueStart: startMonth, valueEnd: endMonth, type },
    { id: 3, label: t('business:lastMonth'), valueStart: startLastMonth, valueEnd: endLastMonth, type },
  ];

  const RenderFormat = (startTime: string | Date, endTime: string | Date) => {
    const times = `${dayjs(startTime).get('date')} ${t('business:month').toLowerCase()} ${dayjs(startTime).get('month') + 1
      } - ${dayjs(endTime).get('date')} ${t('business:month').toLowerCase()} ${dayjs(endTime).get('month') + 1}`;
    return times;
  };

  return (
    <View>
      {dataMonth.map((el, index) => {
        return (
          <View key={index.toString()}>
            <RenderItem
              label={el.label}
              value={RenderFormat(el.valueStart, el.valueEnd)}
              id={el.id}
              type={el.type}
              onPressCheck={() => {
                setTypeCheck(type);
                setIdCheck(el.id);
                onSaveData(el);
              }}
              typeCheck={typeCheck}
              idCheck={idCheck}
              disabled={true}
            />
          </View>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({});
export default SelectMonth;
