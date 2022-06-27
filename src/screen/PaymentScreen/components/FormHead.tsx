import { MyIcon } from '@components/Icon';
import color from '@helpers/color';
import fontSize from '@helpers/fontSize';
import padding from '@helpers/padding';
import React, { useCallback } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { useFormikContext } from 'formik';
import { debounce } from 'lodash';
import { Input } from 'react-native-elements/dist/input/Input';
import { responsivePixel } from '@helpers/index';

const FormHead = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const formikRef = useFormikContext();
  const deboudSearch = useCallback(
    debounce(() => {
      formikRef.submitForm();
    }, 500),
    [],
  );
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.formIconClose} onPress={() => navigation.goBack()}>
        <MyIcon.IconClose style={styles.iconClose} />
      </TouchableOpacity>
      <View style={styles.input}>
        <Input
          inputStyle={{ minHeight: responsivePixel(32) }}
          leftIconContainerStyle={{ marginVertical: 0, height: responsivePixel(28) }}
          rightIconContainerStyle={{ marginVertical: 0, height: responsivePixel(24) }}
          style={{ fontSize: fontSize.f12, paddingVertical: 0 }}
          inputContainerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
          onChangeText={(text) => {
            formikRef.setFieldValue('filter', text);
            deboudSearch();
          }}
          placeholderTextColor={color.greyChateau}
          placeholder={t('input:name_mission_appointment')}
          renderErrorMessage={false}
          leftIcon={<MyIcon.IconSearch size={13} color={color.icon} />}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: padding.p15,
    backgroundColor: color.white,
    paddingHorizontal: padding.p15,
    paddingTop: padding.p16,
  },
  formInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: padding.p5,
    borderColor: color.hawkesBlue,
    flexDirection: 'row',
    alignItems: 'center',
  },
  formIconClose: {
    paddingRight: padding.p18,
  },
  iconClose: {
    width: 14.13,
    height: 14.55,
    padding: padding.p3,
  },
  formIconSearch: {
    paddingHorizontal: padding.p8,
  },
  iconSearch: {
    width: 14,
    height: 14,
  },
  textInput: {
    paddingVertical: Platform.OS === 'ios' ? padding.p10 : padding.p3,
    fontSize: fontSize.f12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: color.hawkesBlue,
    flex: 1,
  },
});
export default FormHead;
