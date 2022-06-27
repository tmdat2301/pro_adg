import { FieldArrayRenderProps } from 'formik';
import { cloneDeep, get, isArray } from 'lodash';
import React, { useCallback, useImperativeHandle, useState } from 'react';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { color, fontSize, padding, responsivePixel } from '@helpers/index';
import { StyleSheet, TextInputProps, View, TouchableOpacity } from 'react-native';
import AppText from '@components/AppText';
import { COUNTRY_CODE_WIDTH } from '@helpers/constants';
import BaseInput, { BaseInputProps } from '@components/Input/BaseInput';
import { Modalize } from 'react-native-modalize';
import { MyIcon } from '@components/Icon';
import { Input } from 'react-native-elements/dist/input/Input';

interface WrapInputI extends TextInputProps, BaseInputProps {
  arrayHelpers: FieldArrayRenderProps;
  onOpenCountry: () => void;
  textButton: string;
  isPhoneType?: boolean;
}

const WrapInput = (props: WrapInputI, ref: React.ForwardedRef<unknown>) => {
  //! State
  const { arrayHelpers, onOpenCountry, textButton, isPhoneType, ...restProps } = props;
  const [textValue, setTextValue] = useState<string>('');
  const { name, form } = arrayHelpers;
  const { setFieldValue } = form;
  const mobileError = get(form.errors, name);
  const mobileTouched = get(form.touched, name);
  const value = get(form.values, name);

  //! Function
  const getMsgError = (field: string) => {
    if (get(mobileTouched, field)) {
      return isArray(mobileError) ? get(mobileError, field) : mobileError;
    }
    return '';
  };

  const onAdd = () => {
    if (textValue !== '') {
      if (isArray(value) && value.length > 0) {
        const index = value.findIndex((elm: string) => elm.toLocaleLowerCase() === textValue.toLocaleLowerCase());
        if (index !== -1) {
          onRemove(index);
          return setTextValue('');
        }
      }
      arrayHelpers.push(textValue);
      setTextValue('');
    }
  };

  const onRemove = (index: number) => {
    arrayHelpers.remove(index);
  };

  const renderInputFilter = () => {
    return (
      <View style={{ flex: 1, minWidth: 28 }}>
        <Input
          inputStyle={styles.inputStyle}
          inputContainerStyle={{
            borderBottomWidth: 0,
          }}
          placeholderTextColor={color.subText}
          placeholder={restProps.placeholder}
          renderErrorMessage={false}
          containerStyle={{ paddingHorizontal: 0, marginTop: 0 }}
          value={textValue}
          onChangeText={setTextValue}
          onEndEditing={onAdd}
        />
      </View>
    );
  };

  const renderEnterInput = (value: string, index: number) => {
    return (
      <>
        <AppText fontSize={fontSize.f12} value={value} />
        <TouchableOpacity onPress={() => onRemove(index)}>
          <MyIcon.Close width={12} style={{ marginLeft: padding.p5 }} />
        </TouchableOpacity>
      </>
    );
  };

  //! Render
  return (
    <View style={[styles.inputWrapper, { paddingVertical: 6 }]}>
      {!!value &&
        value.map((el: string, index: number) => {
          return (
            <View key={index.toString()} style={styles.enterInputStyles}>
              {renderEnterInput(el, index)}
            </View>
          );
        })}
      {renderInputFilter()}
    </View>
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    fontSize: fontSize.f14,
    minHeight: responsivePixel(28),
    fontFamily: 'OpenSans-Regular',
    paddingBottom: 6,
  },
  enterInputStyles: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.lightGray,
    borderWidth: 1,
    borderColor: color.hawkesBlue,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginRight: 4,
    padding: 4,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: color.brightGray,
    flexWrap: 'wrap',
    alignItems: 'flex-end',
  },
  text: {
    paddingHorizontal: padding.p8,
    color: color.primary,
  },

});

export default React.memo(React.forwardRef(WrapInput));
