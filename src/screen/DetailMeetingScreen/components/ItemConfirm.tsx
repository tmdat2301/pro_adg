import AppText from '@components/AppText';
import fontSize from '@helpers/fontSize';
import { useNavigation } from '@react-navigation/core';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { color, padding } from '@helpers/index';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
export interface ItemConfirmProps {
  textConfirm: string;
  location: string;
  accept: string;
  cancel: string;
  onPressConfirm: () => void;
  onPressCancel: () => void;
}
const ItemConfirm = (props: ItemConfirmProps) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { textConfirm, cancel, accept, location, onPressConfirm, onPressCancel } = props;
  return (
    <View style={styles.container}>
      <AppText value={textConfirm} fontSize={fontSize.f16} style={styles.text} />
      <AppText value={location} fontSize={fontSize.f14} style={styles.location} />
      <View style={styles.borderView} />
      <View style={styles.confirm}>
        <TouchableOpacity
          style={{ flex: 1, alignItems: 'center' }}
          onPress={() => {
            onPressCancel();
          }}>
          <AppText value={cancel} fontSize={fontSize.f14} color={color.text} />
        </TouchableOpacity>
        <View style={styles.borderVertical} />
        <TouchableOpacity
          style={{ flex: 1, alignItems: 'center' }}
          onPress={() => {
            onPressConfirm();
          }}>
          <AppText value={accept} fontSize={fontSize.f14} color={color.mainBlue} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: color.white,
    borderRadius: 8,
    alignItems: 'center',
    width: ScreenWidth * 0.72,
  },
  confirm: {
    width: ScreenWidth * 0.72,
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    marginTop: padding.p20,
    marginBottom: padding.p15,
    // marginHorizontal: padding.p40,
  },
  borderView: {
    // marginBottom: padding.p15,
    backgroundColor: color.centerborder,
    height: 1.5,
    width: '100%',
  },
  borderVertical: {
    width: 1.5,
    height: 50,
    backgroundColor: color.centerborder,
  },
  location: {
    color: color.subText,
    marginBottom: padding.p15,
  },
  left: {},
  right: {},
});
export default memo(ItemConfirm);
