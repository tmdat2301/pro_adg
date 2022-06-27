import React, { FC } from 'react';
import { StyleSheet, TouchableOpacityProps, ViewStyle, TouchableOpacity, View, LayoutChangeEvent } from 'react-native';
import { color, fontSize, padding, responsivePixel } from '@helpers/index';
import AppText from '@components/AppText';
import LinearGradient from 'react-native-linear-gradient';
import { SelectButton } from '@components/index';
import { MyIcon } from '@components/Icon';
import { ButtonGroup } from 'react-native-elements/dist/buttons/ButtonGroup';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import { useTranslation } from 'react-i18next';

export interface DashboardHeaderProps extends TouchableOpacityProps {
  containerStyle?: ViewStyle;
  onLayout: (event: LayoutChangeEvent) => void;
  currentTabIndex: number;
  onChangeTab: (index: number) => void;
  textRightSelected: string;
  textLeftSelected: string;
  onPressButtonLeft: () => void;
  onPressButtonRight: () => void;
  onPressIconNotification: () => void;
  onPressAvatar: () => void;
  unreadCount: number;
  userName?: string;
}

const DashboardHeader: FC<DashboardHeaderProps> = React.memo((props) => {
  const {
    currentTabIndex,
    onChangeTab,
    containerStyle,
    onLayout,
    textLeftSelected = '',
    textRightSelected = '',
    onPressButtonRight,
    onPressButtonLeft,
    onPressIconNotification,
    onPressAvatar,
    userName = '',
    unreadCount = 0,
  } = props;
  const { t } = useTranslation();
  const buttonsText = [t('button:business'), t('button:activity')];

  return (
    <LinearGradient
      locations={[0.2575, 0.7238, 1]}
      colors={[color.primary900, color.primary700, color.primary400]}
      style={[styles.container, containerStyle]}>
      <View onLayout={onLayout} style={styles.headerContainer}>
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={onPressAvatar}>
            <View style={styles.avatar}>
              <AppText>{userName ? userName[0].toLocaleUpperCase() : ''}</AppText>
            </View>
          </TouchableOpacity>
          <AppText fontWeight="semibold" fontSize={fontSize.f16} color={color.white}>
            {t('title:overview')}
          </AppText>
          <TouchableOpacity onPress={onPressIconNotification}>
            <View style={styles.notificationCountView}>
              <AppText style={{ fontSize: 9, textAlign: 'center', color: color.white }}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </AppText>
            </View>
            <MyIcon.Bell />
          </TouchableOpacity>
        </View>
        <ButtonGroup
          onPress={onChangeTab}
          selectedIndex={currentTabIndex}
          buttons={buttonsText}
          textStyle={{ color: color.white }}
          selectedButtonStyle={{ borderRadius: 5, backgroundColor: color.white }}
          selectedTextStyle={{ color: color.text }}
          innerBorderStyle={{ width: 0 }}
          containerStyle={styles.buttonGroupContainer}
        />
        <View style={styles.selectContainer}>
          <View style={{ flex: 1 }}>
            <SelectButton onPress={onPressButtonLeft} title={textLeftSelected} />
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <SelectButton onPress={onPressButtonRight} title={textRightSelected} />
          </View>
        </View>
      </View>
    </LinearGradient>
  );
});

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    height: 195,
    borderBottomLeftRadius: responsivePixel(20),
    borderBottomRightRadius: responsivePixel(20),
  },
  headerContainer: { paddingTop: padding.p28, paddingHorizontal: padding.p16 },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: color.pink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonGroupContainer: {
    marginTop: padding.p12,
    height: padding.p32,
    backgroundColor: color.primary300,
    padding: padding.p2,
    borderRadius: 5,
    borderWidth: 0,
    width: ScreenWidth * 0.6,
    alignSelf: 'center',
  },
  selectContainer: { paddingTop: padding.p4, flexDirection: 'row', justifyContent: 'space-between' },
  title: {
    fontSize: fontSize.f13,
    color: color.white,
    paddingHorizontal: padding.p4,
  },
  notificationCountView: {
    position: 'absolute',
    backgroundColor: color.red,
    justifyContent: 'center',
    alignItems: 'center',
    top: -8,
    left: padding.p8,
    zIndex: 999,
    width: 20,
    height: 18,
    borderRadius: 20,
  },
  unreadNoti: {
    fontSize: 10,
    color: color.white,
  },
});

export default DashboardHeader;
