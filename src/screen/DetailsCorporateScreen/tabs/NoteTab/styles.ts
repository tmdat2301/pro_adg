import { color, padding } from '@helpers/index';
import { StyleSheet } from 'react-native';
import { ScreenWidth } from 'react-native-elements/dist/helpers';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
  viewFilter: {
    width: ScreenWidth,
    height: 28,
    backgroundColor: color.lightGray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: padding.p16,
  },
});
