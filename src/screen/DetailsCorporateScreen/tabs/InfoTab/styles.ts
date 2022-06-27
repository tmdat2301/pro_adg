import { color, padding } from '@helpers/index';
import { StyleSheet } from 'react-native';
import { ScreenWidth } from 'react-native-elements/dist/helpers';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  viewFilter: {
    width: ScreenWidth,
    height: 28,
    backgroundColor: color.lightGray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchItemSheet: {
    width: ScreenWidth - 32,
    marginHorizontal: padding.p16,
  },
  textItemSheet: {
    paddingVertical: padding.p12,
  },
  lineItemSepe: {
    width: '100%',
    height: 1,
    backgroundColor: color.hawkesBlue,
  },
  centerHeader: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  headerBotSheet: {
    width: ScreenWidth,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
