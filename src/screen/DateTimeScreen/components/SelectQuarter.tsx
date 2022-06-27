import dayjs from 'dayjs';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import RenderItem from './RenderItem';

export interface SelectQuarterProps {
  type: number;
  onSaveData: (value: object) => void;
  idCheck: number | undefined;
  setIdCheck: (id: number) => void;
  typeCheck: number | null | undefined;
  setTypeCheck: (type: number) => void;
}

const SelectQuarter: FC<SelectQuarterProps> = React.memo((props) => {
  const { type, onSaveData = () => {}, idCheck, setIdCheck, typeCheck, setTypeCheck } = props;
  const { t } = useTranslation();

  const today = dayjs(new Date()).toDate();

  const startQui1 = dayjs(today).startOf('year').toDate();
  const qui1 = new Date(startQui1);
  const endQui1 = dayjs(qui1.setMonth(qui1.getMonth() + 2))
    .endOf('month')
    .toDate();

  const startQui2 = new Date(endQui1);
  startQui2.setDate(startQui2.getDate() + 1);
  const qui2 = new Date(startQui2);
  const endQui2 = dayjs(qui2.setMonth(qui2.getMonth() + 2))
    .endOf('month')
    .toDate();

  const startQui3 = new Date(endQui2);
  startQui3.setDate(startQui3.getDate() + 1);
  const qui3 = new Date(startQui3);
  const endQui3 = dayjs(qui3.setMonth(qui3.getMonth() + 2))
    .endOf('month')
    .toDate();

  const startQui4 = new Date(endQui3);
  startQui4.setDate(startQui4.getDate() + 1);
  const qui4 = new Date(startQui4);
  const endQui4 = dayjs(qui4.setMonth(qui4.getMonth() + 2))
    .endOf('month')
    .toDate();

  const dataQuarter = [
    { id: 1, label: t('business:quarter', { value: 'I' }), valueStart: startQui1, valueEnd: endQui1, type },
    { id: 2, label: t('business:quarter', { value: 'II' }), valueStart: startQui2, valueEnd: endQui2, type },
    { id: 3, label: t('business:quarter', { value: 'III' }), valueStart: startQui3, valueEnd: endQui3, type },
    { id: 4, label: t('business:quarter', { value: 'IV' }), valueStart: startQui4, valueEnd: endQui4, type },
  ];

  const RenderFormat = (startTime: string | Date, endTime: string | Date) => {
    const times = `${dayjs(startTime).get('date')} ${t('business:month').toLowerCase()} ${
      dayjs(startTime).get('month') + 1
    } - ${dayjs(endTime).get('date')} ${t('business:month').toLowerCase()} ${dayjs(endTime).get('month') + 1}`;
    return times;
  };

  return (
    <View>
      {dataQuarter.map((el, index) => {
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

export default SelectQuarter;
