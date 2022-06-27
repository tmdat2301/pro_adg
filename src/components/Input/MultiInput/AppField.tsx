import React from 'react';
import { Field, FieldProps } from 'formik';
import { StyleProp, ViewStyle } from 'react-native';
import { DropDownMutilineProps } from '@components/DropDownMutiline';

export interface AppFieldI extends DropDownMutilineProps {
  containerStyle?: StyleProp<ViewStyle>;
  name: string;
  Component: any;
  [x: string]: any;
}

const AppField: React.FC<AppFieldI> = ({ name, Component, refField, ...rest }) => {
  return <Field name={name}>{(field: FieldProps) => <Component ref={refField} {...rest} fieldFormik={field} />}</Field>;
};

export default React.memo(AppField);
