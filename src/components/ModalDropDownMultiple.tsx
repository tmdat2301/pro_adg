import AppText from '@components/AppText';
import { color, fontSize, padding } from '@helpers/index';
import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScreenHeight } from 'react-native-elements/dist/helpers';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { Input } from 'react-native-elements/dist/input/Input';
import { MyInput } from './Input';

export interface Props {
  data: any[];
  handleClick: (key: string, index: number, type?: any) => void;
  chooseConditions: any[];
  header: string;
  modalHeight?: number;
  isChooseOneCondition?: boolean;
  chooseOneCondition?: any;
  type?: string;
  handleSearch: (key: string) => void;
}

export default forwardRef((props: Props, ref: any) => {
  const { t } = useTranslation();
  const { data, handleClick, chooseConditions, header, handleSearch } = props;

  const renderItem = (title: string, key: string, index: number, type?: any) => {
    const indexConditions = chooseConditions?.findIndex((el) => (el?.key || el) === key);
    return (
      <TouchableOpacity
        style={[styles.itemWrapper, { borderTopWidth: index === 0 ? 0 : 1 }]}
        key={key}
        onPress={() => handleClick(key, index, type)}>
        <AppText
          fontWeight="normal"
          style={{ fontSize: fontSize.f14, color: indexConditions >= 0 ? color.primary : color.black }}
          value={title}
        />
        {indexConditions >= 0 && <Icon name="ios-checkmark-sharp" type="ionicon" color={color.primary} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText fontWeight="semibold" style={{ fontSize: fontSize.f16 }}>
          {header}
        </AppText>
      </View>
      <MyInput.Search onChangeText={handleSearch} placeholder={t('input:search')} />
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {data?.map((el, index) => renderItem(el.title || el.value, el?.key || el, index, el?.type || undefined))}
      </ScrollView>
    </View>
  );
});

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: padding.p16,
    height: ScreenHeight - 200,
    paddingBottom: padding.p24,
  },
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
    marginBottom: padding.p12,
    paddingVertical: padding.p20,
  },
  itemWrapper: {
    borderColor: color.grayLine,
    padding: padding.p12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
