import React, { FC } from 'react';
import { StyleSheet, TouchableOpacityProps, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import { color, fontSize, padding } from '@helpers/index';
import AppText from './AppText';
import { Icon } from 'react-native-elements/dist/icons/Icon';

export interface SelectButtonProps extends TouchableOpacityProps {
  titleStyle?: TextStyle | any;
  containerStyle?: ViewStyle;
  themeColor?: string;
  title: string;
}

const SelectButton: FC<SelectButtonProps> = React.memo((props) => {
  const { titleStyle, title, containerStyle, themeColor = color.white, ...restProps } = props;
  return (
    <TouchableOpacity style={[styles.container, containerStyle]} {...restProps}>
      <AppText numberOfLines={1} style={[styles.title, titleStyle]} color={themeColor}>
        {title}
      </AppText>
      <Icon name="caretdown" type="antdesign" color={themeColor} size={8} />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  button: {
    backgroundColor: color.primary,
    borderWidth: 0,
    paddingVertical: padding.p12,
  },
  title: {
    fontSize: fontSize.f13,
    paddingRight: padding.p4,
  },
});

export default SelectButton;
