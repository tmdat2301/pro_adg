import dayjs from 'dayjs';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import RenderItem from './RenderItem';

export interface SelectWeekProps {
  type: number;
  showCalendar?: () => void;
  valueWeek: any;
  onSaveData: (value: object) => void;
  idCheck: number | undefined;
  setIdCheck: (id: number) => void;
  typeCheck: number | null | undefined;
  setTypeCheck: (type: number) => void;
}

const SelectWeek: FC<SelectWeekProps> = React.memo((props) => {
  const { type, showCalendar = () => {}, valueWeek, onSaveData, idCheck, setIdCheck, typeCheck, setTypeCheck } = props;
  const { t } = useTranslation();

  const today = new Date();

  const startWeek = dayjs().startOf('week').toDate();
  const endWeek = dayjs().endOf('week').toDate();

  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const startLastWeek = dayjs(sevenDaysAgo).startOf('week').toDate();
  const endLastWeek = dayjs(sevenDaysAgo).endOf('week').toDate();

  const dataWeek = [
    { id: 1, label: t('business:sevenDaysAgo'), valueStart: sevenDaysAgo, valueEnd: today, type },
    { id: 2, label: t('business:thisWeek'), valueStart: startWeek, valueEnd: endWeek, type },
    { id: 3, label: t('business:lastWeek'), valueStart: startLastWeek, valueEnd: endLastWeek, type },
    {
      id: 4,
      label: t('business:option'),
      valueStart: valueWeek?.week?.startTime,
      valueEnd: valueWeek?.week?.endTime,
      type,
    },
  ];

  const RenderFormat = (startTime: string | Date, endTime: string | Date) => {
    const times = `${dayjs(startTime).get('date')} ${t('business:month').toLowerCase()} ${
      dayjs(startTime).get('month') + 1
    } - ${dayjs(endTime).get('date')} ${t('business:month').toLowerCase()} ${dayjs(endTime).get('month') + 1}`;
    return times;
  };

  return (
    <View>
      {dataWeek.map((el, index) => {
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
              onPressShowCalendar={() => {
                if (el.label === t('business:option')) {
                  showCalendar();
                }
              }}
              disabled={el.label !== t('business:option')}
            />
          </View>
        );
      })}
    </View>
  );
});

export default SelectWeek;
