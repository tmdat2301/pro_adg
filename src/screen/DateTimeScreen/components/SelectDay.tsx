import { HOURS_MINUTE_FORMAT } from '@helpers/constants';
import dayjs from 'dayjs';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import RenderItem from './RenderItem';

export interface SelectDayProps {
  type: number;
  showCalendar: () => void;
  valueDay: any;
  onSaveData: (value: object) => void;
  idCheck: number | undefined;
  setIdCheck: (id: number) => void;
  typeCheck: number | null | undefined;
  setTypeCheck: (type: number) => void;
}

const SelectDay: FC<SelectDayProps> = React.memo((props) => {
  const { type, showCalendar = () => {}, valueDay, onSaveData, idCheck, setIdCheck, typeCheck, setTypeCheck } = props;
  const { t } = useTranslation();

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const dataDay = [
    { id: 1, label: t('business:today'), value: today, type },
    { id: 2, label: t('business:yesterday'), value: yesterday, type },
    { id: 3, label: t('business:option'), value: valueDay?.day?.startTime, type },
  ];
  const renderFormatDate = (time: string | Date) => {
    let times = dayjs(time).format(HOURS_MINUTE_FORMAT).toString();
    let dayofWeek = '';
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

    times = `${dayofWeek}, ${dayjs(time).get('date')} ${t('business:month').toLowerCase()} ${
      dayjs(time).get('month') + 1
    }`;
    return times;
  };
  return (
    <View>
      {dataDay.map((el, index) => {
        return (
          <View key={index.toString()}>
            <RenderItem
              label={el.label}
              value={renderFormatDate(el.value)}
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

export default SelectDay;
