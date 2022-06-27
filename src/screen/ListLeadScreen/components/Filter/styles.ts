import color from '@helpers/color';
import fontSize from '@helpers/fontSize';
import padding from '@helpers/padding';
import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: padding.p16,
    flex: 1,
    backgroundColor: color.white,
    paddingTop: Platform.OS == 'ios' ? 0 : padding.p24,
  },
  content: {
    backgroundColor: color.lightGray,
    paddingHorizontal: padding.p16,
  },

  addFilterCondition: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: padding.p24,
  },
  text: {
    fontSize: fontSize.f14,
    color: color.primary,
    marginLeft: padding.p8,
  },
  nameContainStyles: {
    backgroundColor: color.white,
    marginTop: padding.p24,
    alignItems: 'center',
    padding: padding.p12,
    flexDirection: 'row',
  },
});
