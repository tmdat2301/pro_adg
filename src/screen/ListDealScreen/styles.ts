import { StyleSheet } from 'react-native';
import { color, fontSize, padding } from '@helpers/index';
import { ScreenWidth } from 'react-native-elements/dist/helpers';

export default StyleSheet.create({
  container: {
    backgroundColor: color.white,
    flex: 1,
    paddingTop: padding.p4,
  },
  body: {
    backgroundColor: color.white,
    marginBottom: padding.p6,
  },
  topHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: padding.p15,
  },
  avaHead: {
    width: 26,
    height: 26,
    marginRight: padding.p28,
  },
  textTopHead: {
    fontSize: fontSize.f16,
    color: color.navyBlue,
    alignItems: 'center',
  },
  formIconHead: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuHead: {
    paddingHorizontal: padding.p16,
    backgroundColor: color.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: padding.p12,
  },
  footerHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: padding.p18,
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: color.pink,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginRight: padding.p28,
  },
  modalHeader: {
    backgroundColor: color.pink,
    width: 70,
    height: 70,
    borderRadius: 35,
    position: 'absolute',
    top: -35,
    left: ScreenWidth / 2 - 35,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
});
