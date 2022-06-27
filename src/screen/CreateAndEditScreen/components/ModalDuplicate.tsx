import AppText from '@components/AppText';
import { color, padding, fontSize } from '@helpers/index';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ScreenWidth } from 'react-native-elements/dist/helpers';

interface duplicateModal {
  title: string;
  onPressOut: () => void;
  dataDuplicate: any[];
  subTitle?: string;
}

const ModalDuplicate = (props: duplicateModal) => {
  const { t } = useTranslation();
  const { title, onPressOut, dataDuplicate, subTitle } = props;
  return (
    <>
      <TouchableOpacity style={styles.modalTouch} disabled activeOpacity={1} onPress={() => onPressOut()}>
        <View style={styles.container}>
          <View style={styles.viewContent}>
            <AppText value={title} fontSize={fontSize.f16} numberOfLines={2} style={{ textAlign: 'center' }} />
            <AppText value={subTitle} fontSize={fontSize.f16} numberOfLines={2} style={{ textAlign: 'center', color: color.gray }} />
            <ScrollView>
              {dataDuplicate.map((el) => (
                <View style={{ paddingHorizontal: padding.p10, paddingVertical: padding.p10 }}>
                  {Object.keys(el).map(function (key, index) {
                    if (el[key]) {
                      if (['recordName'].includes(key)) {
                        return <AppText style={{ fontSize: fontSize.f13 }}>{el.recordName}</AppText>
                      }
                      if (key == 'ownerName') {
                        return (
                          <View style={{ flexDirection: 'row' }}>
                            <AppText color={color.gray}>{t('lead:owner')}:</AppText>
                            <AppText>{el[key]}</AppText>
                          </View>
                        )
                      }
                      if (key == 'mobile') {
                        return (
                          <View style={{ flexDirection: 'row' }}>
                            <AppText color={color.gray}>{t('lead:phone')}:</AppText>
                            <AppText color={color.red}>{el[key]}</AppText>
                          </View>
                        )
                      }
                      return (
                        <View style={{ flexDirection: 'row' }}>
                          <AppText color={color.gray}>{key}:</AppText>
                          <AppText color={color.red}>{el[key]}</AppText>
                        </View>
                      )
                    } else {
                      return null;
                    }

                  })}
                  <View style={styles.lineHSepe} />
                </View>
              ))}
            </ScrollView>
          </View>
          <View style={styles.lineHSepe} />
          <View style={styles.confirm}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => onPressOut()} style={styles.touchChild}>
              <AppText
                value={`${t('button:btn_understand')}`}
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

export default ModalDuplicate;

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.white,
    marginHorizontal: ScreenWidth * 0.14,
    width: ScreenWidth * 0.72,
    minHeight: 250,
    maxHeight: 450,
    borderRadius: padding.p8,
    zIndex: 999,
  },
  viewContent: {
    paddingTop: padding.p20,
    paddingBottom: padding.p16,
    flex: 1,
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
