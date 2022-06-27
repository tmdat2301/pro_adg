import { StyleSheet } from 'react-native';
import { color, fontSize, padding } from '@helpers/index';

export default StyleSheet.create({
  container: { flex: 1 },
  formHead: {
    paddingHorizontal: padding.p16,
  },
  topHead: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: padding.p8,
  },
  textTopHead: {
    fontSize: fontSize.f16,
    paddingLeft: padding.p12,
    lineHeight: padding.p19,
    color: color.white,
  },
  centerHead: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  formAvatar: {
    width: 60,
    height: 60,
    backgroundColor: color.linkWater700,
    borderRadius: padding.p60,
    justifyContent: 'center',
    marginBottom: padding.p4,
  },
  formNameContact: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: padding.p18,
  },
  textName: {
    fontSize: fontSize.f16,
    lineHeight: padding.p19,
    paddingRight: padding.p8,
    color: color.white,
    fontWeight: '500',
  },
  footerHead: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: padding.p32,
  },
  formIconFooter: {
    width: 35,
    height: 35,
    backgroundColor: color.white,
    borderRadius: 35 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewCenter: {
    height: 20,
    backgroundColor: color.white,
    borderTopLeftRadius: padding.p20,
    borderTopRightRadius: padding.p20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  formContent: {
    backgroundColor: color.white,
    paddingTop: padding.p9,
    flex: 1,
  },
  formNumberPhone: {
    flexDirection: 'row',
    paddingHorizontal: padding.p16,
    marginBottom: padding.p8,
    alignItems: 'center',
  },
  iconPhoneContent: {
    marginRight: padding.p8,
  },
  textPhoneContent: {
    fontSize: fontSize.f14,
    fontWeight: '500',
    lineHeight: padding.p18,
  },
  formPhoneContent: {
    paddingLeft: padding.p38,
  },
  formHistoryCall: {
    flexDirection: 'row',
    paddingHorizontal: padding.p16,
    marginBottom: padding.p12,
    alignItems: 'center',
  },
  iconHistoryCall: {
    marginRight: padding.p8,
  },
  textHistoryCall: {
    fontSize: fontSize.f14,
    fontWeight: '500',
    lineHeight: padding.p18,
  },
  formListCall: {
    paddingHorizontal: padding.p16,
  },
  stylesDay: {
    marginBottom: padding.p2,
  },
  itemHistoryCall: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: padding.p8,
    borderBottomWidth: 1,
    borderBottomColor: color.centerborder,
  },
});
