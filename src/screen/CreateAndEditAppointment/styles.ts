import color from '@helpers/color';
import fontSize from '@helpers/fontSize';
import padding from '@helpers/padding';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  wrapper: {
    backgroundColor: color.white,
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: color.white,
    paddingBottom: padding.p12,
  },
  titleStyles: {
    paddingTop: padding.p16,
    fontSize: fontSize.f16,
    textAlign: 'center',
  },
});
