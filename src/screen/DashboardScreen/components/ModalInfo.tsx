import React, { FC, ReactChild } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { color, fontSize, padding, responsivePixel } from '@helpers/index';
import { AppText } from '@components/index';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MyIcon } from '@components/Icon';
import { useTranslation } from 'react-i18next';
import { AppRoutes } from '@navigation/appRoutes';

export interface ModalInfoProps {
  onNavigate: (screenName: AppRoutes) => void;
  onLogout: () => void;
  title: string;
  mail: string;
}

const ModalInfo: FC<ModalInfoProps> = React.memo((props) => {
  const { mail, title, onNavigate, onLogout } = props;
  const { t } = useTranslation();

  const renderButton = (icon: ReactChild, titleButton: string, onPress: () => void, textColor: string = color.text) => {
    return (
      <TouchableOpacity style={styles.button} onPress={onPress}>
        {icon}
        <AppText fontSize={fontSize.f14} color={textColor} style={{ padding: padding.p8 }}>
          {titleButton}
        </AppText>
      </TouchableOpacity>
    );
  };
  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: useSafeAreaInsets().bottom,
        },
      ]}>
      <View />
      <AppText fontSize={fontSize.f16} style={{ textAlign: 'center' }} fontWeight={'semibold'}>
        {title}
      </AppText>
      <AppText
        fontSize={fontSize.f14}
        style={{ textAlign: 'center', paddingVertical: padding.p8 }}
        color={color.subText}>
        {mail}
      </AppText>
      {renderButton(<MyIcon.Profile />, t('button:profile'), () => onNavigate(AppRoutes.PROFILE))}
      {renderButton(<MyIcon.Phonebook />, t('button:phonebook'), () => onNavigate(AppRoutes.PHONEBOOK))}
      {renderButton(<MyIcon.Payment />, t('button:create_payment_request'), () =>
        onNavigate(AppRoutes.CREATE_PAYMENT_REQUEST),
      )}
      {renderButton(<MyIcon.Logout />, t('button:logout'), onLogout, color.red)}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: padding.p40,
  },
  avatar: {
    width: responsivePixel(70),
    height: responsivePixel(70),
    borderRadius: responsivePixel(35),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.pink,
    position: 'absolute',
    top: -responsivePixel(35),
    zIndex: 99,
  },
  button: {
    paddingHorizontal: padding.p16,
    paddingVertical: padding.p8,
    flexDirection: 'row',
    borderColor: color.lightGrayBorder,
    borderTopWidth: 1,
    alignItems: 'center',
  },
});
export default ModalInfo;
