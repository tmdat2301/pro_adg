import { color, padding, fontSize } from '@helpers/index';
import { StyleSheet } from 'react-native';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: color.white,
    paddingBottom: padding.p12,
  },
  scrollInput: {
    flex: 1,
    backgroundColor: color.lightGray,
    // padding: padding.p16,
  },
  headerBottomSheet: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: padding.p24,
  },
  lineItemSepe: {
    width: '100%',
    height: 1,
    backgroundColor: color.hawkesBlue,
  },
  touchItemSheet: {
    width: ScreenWidth - 32,
    marginHorizontal: padding.p16,
  },
  textItemSheet: {
    paddingVertical: padding.p12,
  },
  viewBorder: {
    marginHorizontal: padding.p16,
    padding: padding.p8,
    backgroundColor: color.white,
    borderRadius: padding.p4,
    marginBottom: padding.p18,
  },
  textTitle: {
    marginHorizontal: padding.p16,
    marginVertical: padding.p6,
  },
  button: {
    paddingHorizontal: padding.p16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputSheet: {
    marginBottom: padding.p12,
    borderRadius: padding.p6,
    borderColor: color.hawkesBlue,
    borderWidth: 2,
  },
  inputTextSheet: { fontSize: fontSize.f12, paddingVertical: 0 },
});
