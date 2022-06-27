import React, { FC, memo, useRef, useState } from 'react';
import { Animated, Platform, StyleProp, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Input, InputProps } from 'react-native-elements';
import { FormikErrors } from 'formik';
import { color, fontSize } from '@helpers/index';
import AppText from '@components/AppText';
import { COUNTRY_CODE_WIDTH } from '@helpers/constants';

type ValidateMode = 'onBlur' | 'onChange';

export interface BaseInputProps extends InputProps {
  name?: string;
  successMessage?: string;
  validateMode?: ValidateMode;
  isRequire?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  onChangeTextData?: (text: string) => void;
  errors?: FormikErrors<any>;
  onPress?: () => void;
  disable?: boolean;
}
interface State {
  text: string;
  isFocused: boolean;
  lineColor: string;
  borderBottomColor: string;
  fontColor: string;
  hasError: boolean;
}

const BaseInput: FC<BaseInputProps> = (props) => {
  const { name, successMessage, isRequire = false, errors, onPress, disable = false, ...inputProps } = props;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { errorStyle, containerStyle, labelStyle, inputStyle, onChangeTextData, ...restInputProps } = inputProps;
  const [inputState, setInputState] = useState<State>({
    text: restInputProps.value || '',
    isFocused: false,
    lineColor: color.grayLine,
    borderBottomColor: color.grayLine,
    fontColor: color.subText,
    hasError: false,
  });

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: inputState.text === '' ? 0 : 1,
      duration: inputState.text === '' ? 0 : 375,
      useNativeDriver: true,
    }).start();
  }, [inputState.text, fadeAnim, restInputProps.value]);

  React.useEffect(() => {
    setInputState((state) => ({
      ...state,
      text: restInputProps.value || '',
    }));
  }, [restInputProps.value]);

  const handleFocus = () => {
    setInputState((state) => ({
      ...state,
      isFocused: true,
      lineColor: color.mainBlue,
      borderBottomColor: color.mainBlue,
      fontColor: color.mainBlue,
    }));
  };

  const handleBlur = () =>
    setInputState((state) => ({
      ...state,
      isFocused: false,
      lineColor: color.grayLine,
      borderBottomColor: color.grayLine,
      fontColor: color.subText,
    }));

  const onChangeData = (text: string) => {
    onChangeTextData && onChangeTextData(text);
    setInputState((state) => ({
      ...state,
      text: text,
    }));
  };

  const localInputStyle: StyleProp<TextStyle> = {
    ...styles.input,
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      disabled={disable}
      onPress={onPress}
      style={[styles.container, containerStyle, disable && { opacity: 0.5 }]}>
      {inputState.text !== '' && (
        <Animated.View
          style={{
            paddingLeft: restInputProps.leftIcon ? COUNTRY_CODE_WIDTH + 4 : 0,
            opacity: fadeAnim,
            marginTop: 4,
          }}>
          <Animated.Text style={[styles.text, { color: inputState.fontColor }, labelStyle]}>
            {restInputProps.placeholder || ' '}
            <AppText style={styles.text} color={color.red}>
              {isRequire && restInputProps.placeholder !== '' ? '*' : ' '}
            </AppText>
          </Animated.Text>
        </Animated.View>
      )}
      <Input
        onFocus={handleFocus}
        containerStyle={StyleSheet.flatten([styles.containerInput, containerStyle])}
        inputStyle={[
          localInputStyle,
          {
            fontFamily: 'OpenSans-Regular',
            fontSize: fontSize.f14,
            minHeight: 26,
            paddingVertical: inputState.text !== '' ? 0 : 12,
            paddingTop: inputState.text !== '' ? 0 : 10,
          },
          inputStyle,
        ]}
        errorStyle={StyleSheet.flatten([
          {
            color: color.red,
            marginHorizontal: 0,
            marginBottom: 0,
            fontFamily: 'OpenSans-Regular',
          },
          errorStyle,
        ])}
        errorMessage={errors && name ? errors[name]?.toString() ?? '' : ''}
        renderErrorMessage={inputState.hasError}
        inputContainerStyle={{ borderBottomColor: inputState.hasError ? color.red : inputState.borderBottomColor }}
        onBlur={handleBlur}
        onChangeText={(text) => onChangeData(text)}
        placeholderTextColor={color.subText}
        leftIconContainerStyle={styles.iconContainer}
        rightIconContainerStyle={styles.iconContainer}
        {...restInputProps}
        placeholder={
          isRequire && restInputProps.placeholder !== ''
            ? `${restInputProps.placeholder || ''}*`
            : restInputProps.placeholder
        }
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { minHeight: 46, justifyContent: 'flex-start', marginBottom: 2 },
  label: {
    color: color.black,
    fontSize: 12,
    height: 0,
  },
  text: {
    includeFontPadding: false,
    textAlignVertical: 'center',
    fontSize: 12,
  },
  input: {
    fontSize: fontSize.f14,
    fontFamily: 'OpenSans-Regular',
  },
  containerInput: {
    paddingHorizontal: 0,
  },
  successText: {
    marginVertical: 4,
    color: color.primary,
  },
  guide: {
    paddingLeft: Platform.select({
      android: 4,
      ios: 0,
    }),
    fontSize: 12,
    marginBottom: 24,
  },
  iconContainer: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 4,
    marginVertical: 0,
  },
});

export default memo(BaseInput);
