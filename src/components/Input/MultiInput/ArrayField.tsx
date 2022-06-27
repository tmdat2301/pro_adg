import React from 'react';
import { FieldArray } from 'formik';
import { StyleProp, TextInputProps, ViewStyle } from 'react-native';
import { BaseInputProps } from '@components/Input/BaseInput';

interface ArrayFieldI extends TextInputProps, BaseInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  textButton?: string;
  isPhoneType?: boolean;
  isCorporate?: boolean;
  name: string;
  Component: any;
  [x: string]: any;
}

const ArrayField: React.FC<ArrayFieldI> = ({ name, Component, textButton, refField, ...rest }) => {
  return (
    <FieldArray
      name={name}
      render={(arrayHelpers) => (
        <Component ref={refField} textButton={textButton} arrayHelpers={arrayHelpers} {...rest} />
      )}
    />
  );
};

export default React.memo(ArrayField);
