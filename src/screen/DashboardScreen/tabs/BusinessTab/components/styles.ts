import { color, padding } from '@helpers/index';
import { StyleSheet } from 'react-native';

const childStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
    borderRadius: padding.p8,
    paddingVertical: padding.p16,
    paddingHorizontal: padding.p8,
  },
  lineSeperator: {
    width: '100%',
    height: 1,
    backgroundColor: color.grayLine,
    marginVertical: padding.p8,
  },
  viewInfo: {
    alignItems: 'center',
  },
  viewInfoChild: {
    alignItems: 'center',
  },
  viewRowInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: padding.p4,
  },
  mr8: {
    marginRight: padding.p8,
  },
  ml8: {
    marginLeft: padding.p8,
  },
});

export { childStyles };
