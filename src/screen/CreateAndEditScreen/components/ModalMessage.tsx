import AppText from '@components/AppText';
import { color, padding, fontSize } from '@helpers/index';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ScreenWidth } from 'react-native-elements/dist/helpers';

interface duplicateModal {
  title: string;
  onPressOut: () => void;
  dataDuplicate?: any[];
  message: string;
}

const ModalMessage = (props: duplicateModal) => {
  const { t } = useTranslation();
  const { title, onPressOut, dataDuplicate, message } = props;
  return (
    <>
      <TouchableOpacity style={styles.modalTouch} disabled activeOpacity={1} onPress={() => onPressOut()}>
        <View style={styles.container}>
          <View style={styles.viewContent}>
            <AppText value={title} fontSize={fontSize.f16} numberOfLines={2} style={{ textAlign: 'center' }} />
            <ScrollView>
              <AppText style={{ fontSize: fontSize.f13 }}>{message}</AppText>
            </ScrollView>
          </View>
          <View style={styles.lineHSepe} />
          <View style={styles.confirm}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => onPressOut()} style={styles.touchChild}>
              <AppText
                value={'Đóng' || `${t('button:cancel')}`}
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

export default ModalMessage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.white,
    marginHorizontal: ScreenWidth * 0.14,
    width: ScreenWidth * 0.72,
    minHeight: 200,
    maxHeight: 450,
    borderRadius: padding.p8,
    zIndex: 999,
  },
  viewContent: {
    paddingTop: padding.p20,
    paddingBottom: padding.p16,
    flex: 1,
    paddingHorizontal: padding.p16
    // backgroundColor: 'red'
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
    backgroundColor: color.black60,
    zIndex: 10,
  },
  confirm: {
    width: ScreenWidth * 0.72,
    alignItems: 'center',
    flexDirection: 'row',
  },

});
