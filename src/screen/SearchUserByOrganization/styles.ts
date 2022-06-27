import { StyleSheet } from 'react-native';
import { color, fontSize, padding } from '@helpers/index';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
  textContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: padding.p16,
    borderBottomWidth: 1,
    borderBottomColor: color.grayLine,
  },
  emptyText: {
    flex: 1,
    textAlign: 'center',
    fontSize: fontSize.f14,
    color: color.text,
  },
});
