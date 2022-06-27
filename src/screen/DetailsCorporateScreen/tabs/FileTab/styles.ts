import { color, padding } from '@helpers/index';
import { StyleSheet } from 'react-native';
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';

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
    paddingHorizontal: padding.p16,
  },
  filterText: {
    color: color.subText,
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
  modalImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'black',
    height: ScreenHeight,
  },
  imageViewer: {
    width: '100%',
    height: ScreenHeight / 2,
  },
  loading: { alignItems: 'center', justifyContent: 'center' },
});
