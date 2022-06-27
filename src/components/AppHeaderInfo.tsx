import React from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { color, padding, fontSize } from '@helpers/index';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '.';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import { useNavigation } from '@react-navigation/core';
import AppMenu, { ItemAppMenuProps } from './AppMenu';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

interface IAppHeaderInfoProps {
  onLeftPress?: () => void;
  onRightPress?: () => void;
  name: string;
  role: string | null;
  onPhoneActions?: () => void;
  onMailActions?: () => void;
  onEditActions?: () => void;
  textExtra?: string;
  onPressWhenManyValues?: () => void;
  isRolePress?: boolean;
  listPhone: ItemAppMenuProps[];
}

const AppHeaderInfo = (props: IAppHeaderInfoProps) => {
  const navigation = useNavigation();
  const {
    onLeftPress,
    onRightPress,
    name,
    role,
    onEditActions,
    onMailActions,
    onPhoneActions,
    onPressWhenManyValues,
    textExtra,
    isRolePress,
    listPhone,
  } = props;
  const { t } = useTranslation();
  const renderIconCall = () => {
    if (listPhone.length === 0) {
      return (
        <TouchableOpacity
          onPress={() => {
            Toast.show({ type: 'error', text1: t('lead:notice'), text2: t('label:phoneUndefined') });
          }}
          activeOpacity={0.8}
          style={styles.iconBotHeader}>
          <Icon type="antdesign" name="phone" color={color.icon} size={16} />
        </TouchableOpacity>
      );
    } else if (listPhone.length === 1) {
      return (
        <TouchableOpacity onPress={() => listPhone[0].function()} activeOpacity={0.8} style={styles.iconBotHeader}>
          <Icon type="antdesign" name="phone" color={color.icon} size={16} />
        </TouchableOpacity>
      );
    } else {
      return (
        <AppMenu position="right" data={listPhone ? listPhone : []}>
          <View style={styles.iconBotHeader}>
            <Icon type="antdesign" name="phone" color={color.icon} size={16} />
          </View>
        </AppMenu>
      );
    }
  };

  return (
    <SafeAreaView edges={['top', 'right', 'left']} style={styles.safeContainer}>
      <View style={styles.headerBotSheet}>
        <TouchableOpacity
          onPress={() => {
            onLeftPress ? onLeftPress() : navigation.popToTop();
          }}
          style={[styles.leftHeader, { justifyContent: 'center' }]}>
          <Icon type={'antdesign'} name={'left'} color={color.primary} />
          {/* <MyIcon.ArrowBack fill={color.primary} /> */}
        </TouchableOpacity>
        <View style={[styles.centerHeader, { alignItems: 'center' }]}>
          <View style={styles.centerAvatar}>
            <AppText value={name.substring(0, 1)} color={color.black} fontSize={fontSize.f16} />
          </View>
          <View
            style={[
              styles.centerLeadInfo,
              { height: textExtra ? 48 : 36, justifyContent: textExtra ? 'flex-start' : 'center' },
            ]}>
            <AppText value={name} color={color.black} fontSize={fontSize.f16} numberOfLines={1} />
            {role && !!role.trim() ? (
              <AppText
                value={role}
                color={isRolePress ? color.navyBlue : color.subText}
                fontSize={fontSize.f12}
                onPress={() => {
                  if (isRolePress) {
                    onPressWhenManyValues ? onPressWhenManyValues() : {};
                  }
                }}
              />
            ) : null}
            {textExtra ? <AppText value={textExtra + ' VNĐ'} fontSize={fontSize.f12} /> : null}
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            onRightPress && onRightPress();
          }}
          style={[styles.rightHeader, { justifyContent: 'center' }]}>
          <Icon type={'entypo'} name={'dots-three-vertical'} color={color.primary} size={15} />
        </TouchableOpacity>
      </View>

      <View style={styles.viewBotHeader}>
        {renderIconCall()}
        <TouchableOpacity
          onPress={() => {
            onMailActions && onMailActions();
          }}
          activeOpacity={0.8}
          style={styles.iconBotHeader}>
          <Icon type="antdesign" name="mail" color={color.icon} size={16} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onEditActions && onEditActions();
          }}
          activeOpacity={0.8}
          style={styles.iconBotHeader}>
          <Icon type="antdesign" name="edit" color={color.icon} size={16} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: color.white,
  },
  headerBotSheet: {
    width: ScreenWidth,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftHeader: {
    width: 48,
    height: 48,
    alignItems: 'center',
  },
  rightHeader: {
    width: 48,
    height: 48,
    alignItems: 'center',
  },
  centerHeader: {
    flex: 1,
    height: 48,
    width: ScreenWidth / 2,
    justifyContent: 'center',
    flexDirection: 'row',
    marginHorizontal: padding.p24,
  },
  centerAvatar: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.avatar,
    borderRadius: 36,
    marginLeft: padding.p16,
  },
  centerLeadInfo: {
    height: 48,
    marginHorizontal: padding.p8,
    justifyContent: 'center',
    marginRight: padding.p16,
  },
  iconBotHeader: {
    height: 25,
    width: 25,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.lightGray,
    marginHorizontal: padding.p14,
    padding: 2,
  },
  viewBotHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: padding.p12,
    flexDirection: 'row',
  },
});

export default AppHeaderInfo;
