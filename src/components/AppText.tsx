import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import { fontSize, color as AppColor } from '@helpers/index';

export type AppTextProps = {
  value?: string | number | null;
  fontSize?: number;
  color?: string;
  fontWeight?: FontWeightType;
  fontFamily?: FontType;
} & TextProps;
// if customize fonts
export type FontType =
  | 'OpenSans-Bold'
  | 'OpenSans-BoldItalic'
  | 'OpenSans-ExtraBold'
  | 'OpenSans-ExtraBoldItalic'
  | 'OpenSans-Italic'
  | 'OpenSans-Light'
  | 'OpenSans-LightItalic'
  | 'OpenSans-Medium'
  | 'OpenSans-MediumItalic'
  | 'OpenSans-Regular'
  | 'OpenSans-SemiBold'
  | 'OpenSans-SemiBoldItalic';
export type FontWeightType = 'normal' | 'medium' | 'bold' | 'black' | 'light' | 'semibold';
export const defaultProps: Partial<AppTextProps> = {
  fontSize: fontSize.f14,
};

const AppText: React.FC<AppTextProps> = React.memo(
  ({ children, color = AppColor.text, value, fontFamily, fontWeight, fontSize, ...props }) => {
    return (
      <Text
        {...props}
        allowFontScaling={false}
        style={StyleSheet.flatten([
          {
            fontSize,
            color,
            fontFamily: 'OpenSans-Regular',
            lineHeight: fontSize ? fontSize + 4 : fontSize,
          },
          fontWeight === 'medium' && {
            fontFamily: 'OpenSans-Medium',
          },
          fontWeight === 'bold' && {
            fontFamily: 'OpenSans-Bold',
          },
          fontWeight === 'light' && {
            fontFamily: 'OpenSans-Light',
          },
          fontWeight === 'semibold' && {
            fontFamily: 'OpenSans-SemiBold',
          },
          props.style,
        ])}>
        {value ? value : children}
      </Text>
    );
  },
);

export default AppText;
