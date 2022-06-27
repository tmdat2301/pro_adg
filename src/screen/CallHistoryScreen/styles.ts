import { responsivePixel, color, fontSize, padding } from '@helpers/index';

import { StyleSheet } from 'react-native';
import { ScreenWidth } from 'react-native-elements/dist/helpers';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: padding.p8,
    paddingBottom: padding.p4,
    paddingRight: padding.p16,
  },
  textName: {
    fontSize: fontSize.f14,
    color: color.blackMatter,
    lineHeight: fontSize.f18,
  },
  textPhone: {
    fontSize: fontSize.f12,
    lineHeight: 18,
    color: color.textPhone,
  },
  textTime: {
    fontSize: fontSize.f12,
    lineHeight: fontSize.f18,
    color: color.textPhone,
  },
  arrow: {
    paddingLeft: padding.p16,
    marginRight: padding.p8,
    height: responsivePixel(36),
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: color.hawkesBlue,
    flex: 1,
    marginRight: padding.p16,
  },
  viewItem: {
    flexDirection: 'row',
    flex: 1,
    paddingBottom: padding.p4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: padding.p16,
    marginBottom: padding.p12,
  },
  textCall: {
    marginVertical: padding.p8,
    color: color.subText,
    fontSize: fontSize.f12,
    lineHeight: fontSize.f18,
    marginLeft: padding.p16,
  },
  textAllMissed: {
    fontSize: fontSize.f14,
    textAlign: 'center',
    textTransform: 'capitalize',
    paddingVertical: 0,

    fontStyle: 'normal',
  },
  callForward: {
    color: color.primary,
  },
  back: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: padding.p12,
  },
  borderBottom: {
    height: 1,
    marginRight: padding.p16,
    backgroundColor: color.centerborder,
    marginLeft: padding.p44,
  },
  iconCallstatus: {
    marginRight: padding.p10,
    marginLeft: padding.p16,
    justifyContent: 'center',
  },
});
