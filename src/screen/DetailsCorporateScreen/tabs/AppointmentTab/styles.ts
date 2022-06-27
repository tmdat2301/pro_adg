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
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineSepe: {
    width: ScreenWidth,
    height: 8,
    backgroundColor: color.lightGray,
  },
  headerBotSheet: {
    width: ScreenWidth,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftHeader: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightHeader: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerHeader: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
