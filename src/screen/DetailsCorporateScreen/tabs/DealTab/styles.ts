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
  lineSepe: {
    height: 4,
    width: ScreenWidth,
    backgroundColor: color.grayLine,
  },
  safebottom: {
    backgroundColor: color.white,
    shadowColor: 'rgba(29, 36, 62, 1)',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 20,
  },
  rowSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: padding.p16,
  },
  headerBotSheet: {
    width: ScreenWidth,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerHeader: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
