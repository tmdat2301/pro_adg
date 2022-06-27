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
  centerAvatar: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.avatar,
    borderRadius: 30,
  },
  centerLeadInfo: {
    marginHorizontal: padding.p8,
  },
  tabLead: {
    width: ScreenWidth * 0.202,
    height: ScreenWidth * 0.08,
  },
  pipeLineContainer: {
    maxHeight: ScreenWidth * 0.2856,
    alignItems: 'center',
  },
  ph16: {
    paddingHorizontal: padding.p16,
  },
  modalTouch: {
    flex: 1,
    opacity: 0.4,
    backgroundColor: color.black,
    zIndex: 10,
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
  headerBottomSheet: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: padding.p24,
  },
  viewLR: { width: 56 },
  lineSepe: {
    height: 4,
    width: ScreenWidth,
    backgroundColor: color.grayLine,
  },
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
