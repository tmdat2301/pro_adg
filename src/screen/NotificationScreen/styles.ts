import { StyleSheet } from 'react-native';
import { color, padding } from '@helpers/index';

export default StyleSheet.create({
  container: {},
  header: {
    justifyContent: 'space-between',
    backgroundColor: color.white,
    flexDirection: 'row',
    paddingTop: padding.p18,
    paddingBottom: padding.p12,
    marginBottom: padding.p16,
  },
  item: {
    // flex:1,
    paddingTop: padding.p10,
    flexDirection: 'row',
    paddingRight: padding.p14,
    backgroundColor: color.white,
    marginBottom: padding.p8,
    marginHorizontal: padding.p14,
  },
});
