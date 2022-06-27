// import React, { FC } from 'react';
// import { StyleSheet, TouchableNativeFeedback, ViewStyle, TextStyle } from 'react-native';
// import { Button, ButtonProps } from 'react-native-elements';
// import { color, fontSize, padding } from '@helpers/index';
// import { isIOS } from 'react-native-elements/dist/helpers';

// export interface BaseButtonProps extends ButtonProps {
// titleStyle?: TextStyle | any;
// buttonStyle?: ViewStyle;
// containerStyle?: ViewStyle;
// disabled?: boolean;
// type?: any;
// }

// const AppButton: FC<BaseButtonProps> = React.memo((props) => {
//   const { titleStyle, buttonStyle, containerStyle, disabled, type, ...restProps } = props;
//   return (
//     <Button
//       type={type}
//       containerStyle={StyleSheet.flatten([styles.container, containerStyle])}
//       titleStyle={StyleSheet.flatten([styles.title, titleStyle])}
// buttonStyle={StyleSheet.flatten([
//   styles.button,
//   buttonStyle,
//   {
//     paddingHorizontal: props?.icon ? padding.p12 : padding.p24,
//   },
// ])}
//       background={TouchableNativeFeedback.Ripple(color.gray, false)}
//       activeOpacity={0.6}
//       disabled={disabled}
//       {...restProps}
//     />
//   );
// });

// const styles = StyleSheet.create({
//   container: {
//     borderRadius: 5,
//     marginBottom: padding.p8,
//   },
//   button: {
//     backgroundColor: color.primary,
//     borderWidth: 0,
//     paddingVertical: padding.p12,
//   },
//   title: {
//     fontSize: fontSize.f16,
//     color: color.white,
//     fontWeight: isIOS ? '500' : 'bold',
//   },
// });

// export default AppButton;

import React, { FC } from 'react';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Button, ButtonProps } from 'react-native-elements';
import { color, fontSize, padding } from '@helpers/index';
import { isIOS } from 'react-native-elements/dist/helpers';

export interface BaseButtonProps extends ButtonProps {
  titleStyle?: TextStyle | any;
  buttonStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  disabled?: boolean;
  type?: any;
  children?: any;
  title?: any;
  textStyle?: TextStyle;
  transparent?: boolean;
  cancel?: boolean;
  loading?: boolean;
}

const AppButton: FC<BaseButtonProps> = React.memo((props) => {
  const { titleStyle, disabled, containerStyle } = props;
  return (
    <Button
      {...props}
      containerStyle={StyleSheet.flatten([styles.container, containerStyle])}
      buttonStyle={StyleSheet.flatten([
        !props.cancel ? [styles.defaultStyle, props.buttonStyle] : [styles.OutlineButton, props.buttonStyle],
        { paddingHorizontal: props?.icon ? padding.p12 : padding.p24 },
      ])}
      type={!props.cancel ? 'solid' : 'outline'}
      titleStyle={StyleSheet.flatten([styles.title, titleStyle])}
      disabled={disabled}
      activeOpacity={0.6}
      loading={props.loading}
    />
  );
});
export default AppButton;

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    marginBottom: padding.p8,
  },
  title: {
    fontSize: fontSize.f16,
    color: color.white,
    fontWeight: isIOS ? '400' : 'bold',
    alignSelf: 'center',
  },
  defaultTitle: {
    color: color.white,
  },
  defaultOutline: {
    color: color.primary,
  },
  OutlineButton: {
    // height: 48,
    width: '100%',
    borderColor: color.primary,
    borderWidth: 1,
    borderRadius: 5,
  },
  defaultStyle: {
    // height: 48,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.primary,
  },
});
