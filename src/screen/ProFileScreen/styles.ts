import { StyleSheet } from 'react-native';
import { color, fontSize, padding, responsivePixel } from '@helpers/index';

export default StyleSheet.create({
  wrapHeader: { flex: 1, paddingTop: padding.p18 },
  titleHeader: {
    fontSize: fontSize.f16,
    fontWeight: '600',
    color: color.text,
  },
  label: {
    fontSize: fontSize.f12,
    fontWeight: '400',
    color: color.subText,
    marginTop: padding.p8,
  },
  value: {
    fontSize: fontSize.f12,
    fontWeight: '400',
    color: color.text,
    marginVertical: padding.p4,
  },
});
