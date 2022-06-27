import { color, fontSize, padding } from '@helpers/index';

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: padding.p8,
    paddingBottom: padding.p4,
    borderBottomWidth: 1,
    borderBottomColor: color.centerborder,
    marginLeft: padding.p16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: color.hawkesBlue,
    flex: 1,
    marginRight: padding.p16,
  },
  back: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: padding.p12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: padding.p16,
    marginBottom: padding.p12,
  },
  viewItem: {
    flexDirection: 'row',
    flex: 1,
    paddingBottom: padding.p4,
  },
  textName: {
    fontSize: fontSize.f14,
    color: color.blackMatter,
    lineHeight: fontSize.f18,
  },
  textPhone: {
    fontSize: fontSize.f12,
    color: color.textPhone,
  },
  userIcon: {
    backgroundColor: color.hawkesBlue,
    width: 36,
    height: 36,
    borderRadius: 18,
    padding: padding.p8,
    marginRight: padding.p12,
  },
  separator: {
    flexDirection: 'row',
    height: 1,
    marginLeft: padding.p16,
  },
});
