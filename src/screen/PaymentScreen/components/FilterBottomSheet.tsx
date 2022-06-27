import { AppText } from '@components/index';
import { color, padding, fontSize } from '@helpers/index';
import { useFormikContext } from 'formik';
import { toString } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import { Icon } from 'react-native-elements/dist/icons/Icon';

export interface IItemOptionsProps {
  onPress?: any;
}

const FilterBottomSheet = (props: IItemOptionsProps) => {
  const { onPress } = props;
  const { t } = useTranslation();
  const formikContext = useFormikContext<any>();

  const arrOptions = [
    { value: t('label:all'), id: 0, label: t('label:all'), email: null },
    { value: t('title:mission'), id: 1, label: t('title:mission'), email: null },
    { value: t('label:appointment'), id: 2, label: t('label:appointment'), email: null },
  ];
  return (
    <>
      {arrOptions.map((v, i) => {
        return (
          <>
            <TouchableOpacity
              onPress={() => {
                onPress(v.id);
              }}
              activeOpacity={0.8}
              style={styles.touchItemSheet2}>
              <AppText value={v.value} fontSize={fontSize.f14} style={styles.textItemSheet2} />
              {toString(v.id) === toString(formikContext?.values?.type) && (
                <Icon type="antdesign" name="check" color={color.primary} />
              )}
            </TouchableOpacity>
            <View style={styles.lineItemSepe} />
          </>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  lineItemSepe: {
    width: '100%',
    height: 1,
    backgroundColor: color.hawkesBlue,
  },
  textItemSheet: {
    paddingVertical: padding.p12,
  },
  touchItemSheet2: {
    width: ScreenWidth - 32,
    paddingHorizontal: padding.p16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textItemSheet2: {
    paddingVertical: padding.p12,
    paddingHorizontal: padding.p10,
    width: '98%',
  },
});

export default FilterBottomSheet;
