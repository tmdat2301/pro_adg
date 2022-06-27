import { AppText } from '@components/index';
import { color, padding, fontSize } from '@helpers/index';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScreenWidth } from 'react-native-elements/dist/helpers';

export interface IItemOptionsProps {
  onPress: () => void;
  value: string;
}

const ItemOptions = (props: IItemOptionsProps) => {
  const { value, onPress } = props;
  return (
    <TouchableOpacity
      key={value}
      onPress={() => {
        onPress();
      }}
      activeOpacity={0.8}
      style={styles.touchItemSheet}>
      <AppText value={value} fontSize={fontSize.f14} style={styles.textItemSheet} />
      <View style={styles.lineItemSepe} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  lineItemSepe: {
    width: '100%',
    height: 1,
    backgroundColor: color.hawkesBlue,
  },
  touchItemSheet: {
    width: ScreenWidth - 32,
    marginHorizontal: padding.p16,
  },
  textItemSheet: {
    paddingVertical: padding.p12,
  },
});

export default ItemOptions;
