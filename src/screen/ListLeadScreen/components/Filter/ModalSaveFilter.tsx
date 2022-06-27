import AppText from '@components/AppText';
import { MyInput } from '@components/Input';
import color from '@helpers/color';
import fontSize from '@helpers/fontSize';
import { device } from '@helpers/index';
import padding from '@helpers/padding';
import { Formik, FormikProps } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Input } from 'react-native-elements';
import { CheckBox } from 'react-native-elements/dist/checkbox/CheckBox';
import Modal from 'react-native-modal';
import * as Yup from 'yup';

export interface Props {
  header: string;
  title: string;
  onCloseModal: () => void;
  visible: boolean;
  onConfirm: (isFavorite: boolean, filterName: string) => void;
}

export default (props: Props) => {
  const { header, title, visible, onCloseModal, onConfirm } = props;
  const [check, setCheck] = useState(false);
  const { t } = useTranslation();
  const renderButton = (
    titleButton: string,
    onPress: () => void,
    buttonContainerStyles?: ViewStyle,
    titleButtonStyles?: TextStyle,
  ) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.4}
        style={[styles.buttonContainerStyles, buttonContainerStyles]}>
        <AppText value={titleButton} style={[styles.titleButton, titleButtonStyles]} />
      </TouchableOpacity>
    );
  };

  const handleClose = () => {
    setCheck(false);
    onCloseModal();
  };

  return (
    <Modal onBackdropPress={handleClose} isVisible={visible} style={{ paddingHorizontal: padding.p24 }}>
      <Formik
        initialValues={{
          name: ""
        }}
        onSubmit={(values) => {
          setCheck(false);
          onConfirm(check, values.name.trim());
          handleClose();
        }}
        validateOnChange={false}
        validationSchema={
          Yup.object().shape({
            name: Yup.string().trim().required(t('validate:required_filter_name'))
          })}
      >
        {({ submitForm, values, errors, setFieldValue }) => (
          <View style={styles.modalWrapper}>
            <View style={styles.containerModalStyles}>
              <AppText
                value={header}
                style={{ fontSize: fontSize.f16, textAlign: 'center', marginVertical: padding.p12 }}
              />
              <AppText value={title} />
              <MyInput.Base
                name='name'
                isRequire
                errors={errors}
                placeholder={'Nhập tên bộ lọc'}
                value={values['name']}
                onChangeTextData={(text) => setFieldValue('name', text)}
              />
            </View>
            <CheckBox
              title={'Thêm vào bộ lọc yêu thích'}
              checked={check}
              onPress={() => setCheck(!check)}
              containerStyle={styles.checkBoxContainer}
              checkedColor={color.mainBlue}
              textStyle={{ fontSize: fontSize.f14, fontWeight: 'normal' }}
              activeOpacity={0.5}
            />
            <View style={styles.buttonStyles}>
              {renderButton(t('label:cancel'), handleClose, { borderRightWidth: 1.5 })}
              {renderButton(
                t('lead:confirm'),
                () => { submitForm() },
                {},
                { color: color.primary },
              )}
            </View>
          </View>
        )}
      </Formik>

    </Modal>
  );
};

export const styles = StyleSheet.create({
  modalWrapper: {
    backgroundColor: color.white,
    borderRadius: 7,
  },
  containerModalStyles: {
    borderRadius: padding.p8,
    padding: padding.p16,
  },
  checkBoxContainer: {
    borderWidth: 0,
    padding: 0,
    backgroundColor: color.white,
    marginLeft: padding.p16,
    marginBottom: padding.p16,
  },
  buttonStyles: {
    flexDirection: 'row',
  },
  titleButton: {
    fontSize: fontSize.f14,
    textAlign: 'center',
    marginVertical: padding.p16,
  },
  buttonContainerStyles: {
    borderTopWidth: 1.5,
    borderColor: color.brightGray,
    flex: 1,
  },
  inputStyles: {
    borderWidth: 0,
    height: device.height / 2.5,
  },
});
