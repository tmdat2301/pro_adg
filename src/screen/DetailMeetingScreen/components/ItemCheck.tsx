import AppText from '@components/AppText';
import fontSize from '@helpers/fontSize';
import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { color, padding } from '@helpers/index';
import { Icon } from 'react-native-elements/dist/icons/Icon';
export interface CheckInProps {
  checkStatus: string;
  content: string;
  onPressCheckIn: () => void;
}
const ItemCheckIn = (props: CheckInProps) => {
  const { onPressCheckIn, checkStatus } = props;
  return (
    <TouchableOpacity onPress={onPressCheckIn}>
      <View style={styles.container}>
        <Icon
          type={'antdesign'}
          name={'enviroment'}
          size={fontSize.f17}
          color={color.mainBlue}
          style={{ marginRight: padding.p8 }}
        />
        <AppText color={color.mainBlue} fontSize={fontSize.f14} value={checkStatus} />
      </View>
    </TouchableOpacity>
  );
};
export default memo(ItemCheckIn);
const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    width: 120,
    borderRadius: 4,
    borderColor: color.mainBlue,
    paddingVertical: padding.p4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: padding.p12,
    marginLeft: 46,
  },
});
