import { fontSize, padding, color } from '@helpers/index';
import { useNavigation } from '@react-navigation/native';
import React, { FC, useState } from 'react';
import { StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { ButtonProps } from 'react-native-elements';
import AppText from './AppText';
import { MyIcon } from './Icon';

export interface BaseButtonProps extends ButtonProps {
  iconLeft?: any;
  iconLeftPress?: () => void;
  title: string;
  iconRight?: any;
  iconRightPress?: () => void;
  headerContainerStyles?: ViewStyle;
  titleStyles?: TextStyle;
  isBack?: boolean;
}

const AppHeader: FC<BaseButtonProps> = React.memo((props) => {
  const { iconLeft, iconLeftPress, title, iconRight, iconRightPress, headerContainerStyles, titleStyles, isBack } =
    props;
  const [disableRight, setDisableRight] = useState(false);
  const pressButtonDisabled = () => {
    setDisableRight(true);
    // enable after 1 second
    setTimeout(() => {
      setDisableRight(false);
    }, 1000);
  }


  const navigation = useNavigation();
  return (
    <View style={[styles.headerContainer, headerContainerStyles]}>
      {isBack ? (
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MyIcon.Close />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={{ flex: 1 }} onPress={iconLeftPress}>
          {iconLeft}
        </TouchableOpacity>
      )}
      <AppText fontWeight="semibold" style={[styles.titleStyles, titleStyles]}>
        {title}
      </AppText>
      <View style={{ flex: 1, alignItems: 'flex-end' }}>
        <TouchableOpacity
          disabled={disableRight}
          onPress={() => {
            iconRightPress && iconRightPress();
            pressButtonDisabled();
          }}
        >{iconRight}</TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: padding.p16,
    paddingVertical: padding.p16,
  },
  titleStyles: {
    fontSize: fontSize.f16,
    textAlign: 'center',
  },
});
export default AppHeader;
