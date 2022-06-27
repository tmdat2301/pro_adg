import { AppText } from '@components/index';
import { color, fontSize, padding } from '@helpers/index';
import React, { FC } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export interface RenderItemProps {
  label: string;
  value: string | Date;
  id: string | number;
  type: number;
  onPressCheck?: () => void;
  typeCheck?: number | null | undefined;
  idCheck?: string | number;
  onPressShowCalendar?: () => void;
  disabled?: boolean;
}

const RenderItem: FC<RenderItemProps> = React.memo((props) => {
  const { label, value, id, type, onPressCheck = () => {}, typeCheck, idCheck, onPressShowCalendar = () => {}, disabled } = props;
  return (
    <View style={styles.wrapItem}>
      <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={onPressCheck}>
        <AppText style={styles.labelDate}>{label}</AppText>
        <TouchableOpacity onPress={onPressShowCalendar}
           activeOpacity={1}
          disabled={disabled}
        >
          <AppText style={styles.valueDate}>{value}</AppText>
        </TouchableOpacity>
      </TouchableOpacity>
      {type === typeCheck && id === idCheck && <Icon name="check" size={20} color={color.navyBlue} />}
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
export default RenderItem;
