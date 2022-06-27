import AppText from '@components/AppText';
import { color, padding, fontSize } from '@helpers/index';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ScreenWidth } from 'react-native-elements/dist/helpers';

interface IAppConfirm {
  title: string;
  content: string;
  subContent?: string;
  colorSubContent?: string;
  onPressLeft: () => void;
  onPressRight: () => void;
  textBtnLeft?: string;
  textBtnRight?: string;
  disabledOverlayPress?: boolean;
}

const AppConfirm = (props: IAppConfirm) => {
  const { t } = useTranslation();
  const { content, title, onPressLeft, onPressRight, textBtnLeft, textBtnRight, subContent, colorSubContent } = props;
  return (
    <>
      <TouchableOpacity disabled={true} style={styles.modalTouch} activeOpacity={1} onPress={() => onPressLeft()}>
        <View style={styles.container}>
          <View style={styles.viewContent}>
            <AppText value={title} fontSize={fontSize.f16} numberOfLines={2} style={{ textAlign: 'center' }} />
            <AppText fontSize={fontSize.f14} numberOfLines={4} style={styles.pb16} color={color.subText}>
              {`${content} `}
              <AppText
                value={subContent?.replace('?', '')}
                color={colorSubContent || color.navyBlue}
                fontWeight="semibold"
              />
              {subContent && subContent.includes('?') ? ' ?' : ''}
            </AppText>
          </View>
          <View style={styles.lineHSepe} />
          <View style={styles.confirm}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => onPressLeft()} style={styles.touchChild}>
              <AppText
                value={textBtnLeft || `${t('button:cancel')}`}
                fontSize={fontSize.f14}
                style={{ paddingVertical: padding.p16, alignSelf: 'center' }}
              />
            </TouchableOpacity>
            <View style={styles.lineVSepe} />
            <TouchableOpacity activeOpacity={0.8} onPress={() => onPressRight()} style={styles.touchChild}>
              <AppText
                value={textBtnRight || `${t('button:confirm')}`}
                color={color.mainBlue}
                fontSize={fontSize.f14}
                style={{ paddingVertical: padding.p16, alignSelf: 'center' }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default AppConfirm;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.white,
    marginHorizontal: ScreenWidth * 0.14,
    width: ScreenWidth * 0.72,
    minHeight: 160,
    maxHeight: 250,
    borderRadius: padding.p8,
    zIndex: 999,
  },
  viewContent: {
    paddingTop: padding.p20,
    paddingBottom: padding.p16,
    paddingHorizontal: padding.p16,
    alignItems: 'center',
  },
  pb16: {
    paddingVertical: padding.p16,
    textAlign: 'center',
  },
  lineHSepe: {
    width: '100%',
    height: 1,
    backgroundColor: color.centerborder,
  },
  lineVSepe: {
    height: '100%',
    width: 1,
    backgroundColor: color.centerborder,
  },
  touchChild: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTouch: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.black600,
    zIndex: 10,
  },
  confirm: {
    width: ScreenWidth * 0.72,
    alignItems: 'center',
    flexDirection: 'row',
  },
});
