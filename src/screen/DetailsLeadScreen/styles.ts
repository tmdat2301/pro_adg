import { color, padding, fontSize } from '@helpers/index';
import { StyleSheet } from 'react-native';
import { ScreenWidth } from 'react-native-elements/dist/helpers';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
  whiteScreen: {
    backgroundColor: color.white,
  },
  blueScreen: {
    backgroundColor: color.navyBlue,
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
  pipeLineContainer: {
    maxHeight: ScreenWidth * 0.2856,
    alignItems: 'center',
  },
  lineItemSepe: {
    width: '100%',
    height: 1,
    backgroundColor: color.hawkesBlue,
  },
  touchItemSheet: {
    width: ScreenWidth - 32,
    marginHorizontal: padding.p16,
  },
  textItemSheet: {
    paddingVertical: padding.p12,
  },
  inputSheet: {
    marginBottom: padding.p12,
    borderRadius: padding.p6,
    borderColor: color.hawkesBlue,
    borderWidth: 2,
  },
  inputTextSheet: { fontSize: fontSize.f12, paddingVertical: 0 },
  touchItemSheet2: {
    width: ScreenWidth - 32,
    paddingHorizontal: padding.p16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textItemSheet2: {
    paddingVertical: padding.p12,
    paddingHorizontal: padding.p10,
  },
});
