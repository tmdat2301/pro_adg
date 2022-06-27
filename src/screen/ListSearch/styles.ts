import { responsivePixel, color, fontSize, padding } from '@helpers/index';

import { Platform, StyleSheet } from 'react-native';

export default StyleSheet.create({
  // container: {
  //   flexDirection: 'row',
  //   paddingTop: padding.p8,
  //   paddingBottom: padding.p4,
  //   paddingRight: padding.p16,
  // },
  // left: {
  //   marginBottom: padding.p16,
  //   flex: 1,
  //   marginLeft: padding.p14,
  // },
  // right: {
  //   marginBottom: padding.p16,
  //   flex: 1,
  //   alignItems: 'flex-end',
  //   marginRight: padding.p14,
  // },
  // text: {
  //   color:color.text,
  //   fontSize: fontSize.f13,
  //   marginBottom: padding.p4,
  // },
  container: {
    margin: padding.p16,
  },
  stRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  ndRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  rdRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  // textName: {
  //   fontSize: fontSize.f14,
  //   color: color.blackMatter,
  //   lineHeight: fontSize.f18,
  // },
  // textPhone: {
  //   fontSize: fontSize.f12,
  //   lineHeight: 18,
  //   color: color.textPhone,
  // },
  // textTime: {
  //   fontSize: fontSize.f12,
  //   lineHeight: fontSize.f18,
  //   color: color.textPhone,
  // },

  input: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: color.hawkesBlue,
    flex: 1,
    marginRight: padding.p16,
  },
  // viewItem: {
  //   flexDirection: 'row',
  //   flex: 1,
  //   paddingBottom: padding.p4,
  // },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: padding.p16,
    marginBottom: padding.p12,
    paddingTop: Platform.OS == 'ios' ? 0 : padding.p24
  },

  back: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: padding.p12,
  },
  // borderBottom: {
  //   height: 1,
  //   marginRight: padding.p16,
  //   backgroundColor: color.centerborder,
  //   marginLeft: padding.p44,
  // },
});
