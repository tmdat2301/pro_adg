import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { color, fontSize, padding } from '@helpers/index';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import AppText from '@components/AppText';
import AppMenu, { ItemAppMenuProps } from '@components/AppMenu';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
export interface ItemNameProps {
  itemName: string;
  itemNameColor: string;
  backgroundColorAvatar: string;
  isCall: boolean;
  onCall?: () => void;
  onPress?: () => void;
  listPhone?: ItemAppMenuProps[];
}
const ItemName = (props: ItemNameProps) => {
  const { isCall, itemNameColor, backgroundColorAvatar, itemName, onCall, listPhone, onPress } = props;
  const { t } = useTranslation();
  const renderIconCall = () => {
    if (listPhone) {
      if (listPhone.length === 0) {
        return (
          <TouchableOpacity
            onPress={() => {
              Toast.show({ type: 'error', text1: t('lead:notice'), text2: t('label:phoneUndefined') });
            }}
            activeOpacity={0.8}>
            <Icon type="antdesign" name="phone" color={color.icon} size={18} />
          </TouchableOpacity>
        );
      } else if (listPhone.length === 1) {
        return (
          <TouchableOpacity
            style={{ marginRight: padding.p16 }}
            onPress={() => listPhone[0].function()}
            activeOpacity={0.8}>
            <Icon type="antdesign" name="phone" color={color.icon} size={18} />
          </TouchableOpacity>
        );
      } else {
        return (
          <AppMenu data={listPhone ? listPhone : []}>
            <Icon style={{ marginRight: padding.p16 }} type="antdesign" name="phone" color={color.icon} size={18} />
          </AppMenu>
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.avatar, { backgroundColor: backgroundColorAvatar }]}>
        <AppText fontSize={fontSize.f14} value={itemName[0]} />
      </View>
      <AppText
        fontSize={fontSize.f14}
        value={itemName}
        color={itemNameColor}
        style={{ flex: 1 }}
        onPress={() => {
          if (onPress) {
            onPress();
          }
        }}
      />
      {isCall ? renderIconCall() : null}
    </View>
  );
};
export default memo(ItemName);
const styles = StyleSheet.create({
  container: {
    marginTop: padding.p8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: padding.p44,
    width: ScreenWidth - 52,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  right: {
    marginRight: padding.p16,
  },
  avatar: {
    marginRight: padding.p8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 26,
    width: 26,
    borderRadius: 13,
  },
});
