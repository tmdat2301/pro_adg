import { StyleSheet } from 'react-native';
import { color, fontSize, padding } from '@helpers/index';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
  formDate: {
    paddingVertical: padding.p12,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: padding.p15,
    backgroundColor: color.lightGray,
  },
  bodyFooter: {
    backgroundColor: color.white,
    shadowOpacity: 0.1,
    position: 'absolute',
    width: '100%',
    bottom: 0,
    paddingHorizontal: padding.p15,
  },
  formCosts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: padding.p16,
    paddingBottom: padding.p8,
  },
  textTotalConst: {
    fontSize: fontSize.f12,
    lineHeight: padding.p18,
  },
  textTotalAmount: {
    fontSize: fontSize.f14,
    color: color.primary,
  },
  containLoadmore: {
    width: '100%',
    alignItems: 'center',
  },
  loadmore: {
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: '#FFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
});
