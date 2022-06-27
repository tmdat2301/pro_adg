import React, { memo, FC } from 'react';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { Input } from 'react-native-elements/dist/input/Input';
import { fontSize, color, responsivePixel } from '@helpers/index';
import { StyleProp, StyleSheet, ViewStyle, TextInputProps } from 'react-native';

interface SearchInputProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
}

const SearchInput: FC<SearchInputProps> = (props) => {
  const { containerStyle, ...restProps } = props;
  return (
    <Input
      inputStyle={{ minHeight: responsivePixel(32) }}
      leftIconContainerStyle={{ marginVertical: 0, height: responsivePixel(28) }}
      style={{ fontSize: fontSize.f12 }}
      inputContainerStyle={[styles.container, containerStyle]}
      placeholderTextColor={color.subText}
      renderErrorMessage={false}
      leftIcon={<Icon name="search" size={18} color={color.icon} />}
      {...restProps}
    />
  );
};
const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: color.grayLine,
    borderRadius: 5,
    paddingHorizontal: 8,
  },
});

export default memo(SearchInput);
