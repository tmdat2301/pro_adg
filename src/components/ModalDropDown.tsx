import AppText from '@components/AppText';
import { color, fontSize, padding } from '@helpers/index';
import React, { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements/dist/icons/Icon';

export interface Props {
  handleClick: (key: string, index: number) => void;
  header: string;
  modalHeight?: number;
  selectOne?: any;
  type?: number;
  data?: any[];
}

export default forwardRef((props: Props, ref: any) => {
  const { t } = useTranslation();
  const { handleClick, header, selectOne, data } = props;
  const renderItem = (title: string, key: string, index: number) => {
    return (
      <TouchableOpacity
        style={[styles.itemWrapper, { borderTopWidth: index === 0 ? 0 : 1 }]}
        key={key}
        onPress={() => handleClick(key, index)}>
        <AppText
          fontWeight="normal"
          style={{ fontSize: fontSize.f14, color: selectOne === index ? color.primary : color.black }}
          //@ts-ignore
          value={title}
        />
        {selectOne === index && <Icon name="ios-checkmark-sharp" type="ionicon" color={color.primary} />}
      </TouchableOpacity>
    );
  };


  return (
    <View>
      <View style={styles.header}>
        <AppText fontWeight="semibold" style={{ fontSize: fontSize.f16 }}>
          {header}
        </AppText>
      </View>
      {data?.map((el, index) => renderItem(el.title || el.value, el.key, index))}
    </View>
  );
});

export const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    padding: padding.p24,
  },
  searchWrapper: {
    borderWidth: 1,
    borderColor: color.grayLine,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemWrapper: {
    borderColor: color.grayLine,
    padding: padding.p12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
