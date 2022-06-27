import { DATE_FORMAT } from '@helpers/constants';
import { color, fontSize, padding } from '@helpers/index';
import dayjs from 'dayjs';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import RenderItem from './RenderItem';

export interface SelectOtherProps {
  type: number;
  showCalendar: () => void;
  setIsStart?: (value: boolean) => void;
  valueOther: any;
}

const SelectOther: FC<SelectOtherProps> = React.memo((props) => {
  const { type, showCalendar = () => {}, setIsStart = () => {}, valueOther } = props;
  const { t } = useTranslation();

  const dataOther = [
    {
      id: 1,
      label: t('business:startDate'),
      value: valueOther?.other?.startTime,
      type,
      isStart: true,
    },
    {
      id: 2,
      label: t('business:endDate'),
      value: valueOther?.other?.endTime,
      type,
      isStart: false,
    },
  ];

  const RenderFormatOther = (time: string | Date) => {
    const times = `${dayjs(time).get('date')} ${t('business:month').toLowerCase()} ${dayjs(time).get('month') + 1}`;
    return times;
  };

  return (
    <View>
      {dataOther.map((el, index) => {
        return (
          <View key={index.toString()}>
            <RenderItem
              label={el.label}
              value={RenderFormatOther(el.value)}
              id={el.id}
              type={el.type}
              onPressShowCalendar={() => {
                setIsStart(el.isStart);
                showCalendar();
              }}
            />
          </View>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  labelDate: { color: color.text, fontSize: fontSize.f14, fontWeight: '600' },
  valueDate: { color: color.subText, fontSize: fontSize.f12, fontWeight: '400', marginVertical: padding.p8 },
  wrapItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: padding.p12,
  },
});
export default SelectOther;
