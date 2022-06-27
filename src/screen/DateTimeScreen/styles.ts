import { color, fontSize, padding } from '@helpers/index';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flexDirection: 'row', marginHorizontal: padding.p16, marginVertical: padding.p12 },
  wrapHeader: { flexDirection: 'row', alignItems: 'center' },
  titleHeader: {
    fontSize: fontSize.f16,
    fontWeight: '600',
    color: color.text,
  },
  txtDatetime: {
    fontSize: fontSize.f14,
    fontWeight: '600',
    paddingVertical: padding.p9,
    marginRight: padding.p16,
    color: color.subText,
  },
  txtDatetimePress: {
    color: color.navyBlue,
    borderBottomColor: color.navyBlue,
    borderBottomWidth: 1,
  },
  labelDate: { color: color.text, fontSize: fontSize.f14, fontWeight: '600' },
  valueDate: { color: color.subText, fontSize: fontSize.f12, fontWeight: '400', marginVertical: padding.p8 },
  wrapItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: padding.p12,
  },
});
