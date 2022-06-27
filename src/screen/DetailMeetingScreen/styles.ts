import color from '@helpers/color';
import padding from '@helpers/padding';
import { StyleSheet } from 'react-native';
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';
export default StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: padding.p16,
    marginBottom: padding.p4,
  },
  back: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: padding.p12,
    marginLeft: padding.p12,
  },
  right: {
    flexDirection: 'row',
  },
  bottomText: {
    marginBottom: padding.p14,
    color: color.green900,
  },
  bottomView: {
    width: ScreenWidth,
    justifyContent: 'center',
    paddingVertical: padding.p16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#1D243E',
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
    backgroundColor: color.white,
  },
  fee: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: padding.p16,
    flex: 1,
    backgroundColor: color.white,
    height: ScreenHeight,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: ScreenWidth / 2,
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
