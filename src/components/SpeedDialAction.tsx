import React, { FC, ReactChild } from 'react';
import { StyleSheet, TouchableOpacityProps, ViewStyle, TextStyle, TouchableOpacity, View } from 'react-native';
import { color, fontSize, padding } from '@helpers/index';
import AppText from '@components/AppText';

export interface SpeedDialActionProps extends TouchableOpacityProps {
  titleStyle?: TextStyle | any;
  containerStyle?: ViewStyle;
  icon: ReactChild;
  title: string;
}

const SpeedDialAction: FC<SpeedDialActionProps> = React.memo((props) => {
  const { titleStyle, title, containerStyle, icon, ...restProps } = props;
  return (
    <TouchableOpacity style={[styles.container, containerStyle]} {...restProps}>
      <View style={styles.boxTitle}>
        <AppText style={[styles.title, titleStyle]}>{title}</AppText>
      </View>
      <View style={styles.boxIcon}>{icon}</View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    marginRight: 24,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  boxTitle: {
    paddingHorizontal: padding.p12,
    paddingVertical: padding.p4,
    backgroundColor: color.white,
    borderRadius: 3,
    marginRight: 14,
  },
  boxIcon: {
    width: 30,
    height: 30,
    backgroundColor: color.gray600,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  title: {
    fontSize: fontSize.f12,
    color: color.text,
  },
});

export default SpeedDialAction;
