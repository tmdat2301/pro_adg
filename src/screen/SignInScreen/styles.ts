import { StyleSheet } from 'react-native';
import { color, fontSize, padding, responsivePixel } from '@helpers/index';
import { ScreenHeight } from 'react-native-elements/dist/helpers';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.primary,
  },
  textTitle: { fontWeight: 'bold', fontSize: 44 },
  buttonLoginStyle: { padding: padding.p16, marginTop: padding.p32 },
  textButton: { fontWeight: '600', fontSize: fontSize.f16, marginHorizontal: padding.p8 },
  subText: { textAlign: 'center', padding: padding.p16, color: color.primary },
  inputStyle: { paddingLeft: padding.p16, color: color.text, fontSize: fontSize.f14 },
  contentContainer: { flex: 2, backgroundColor: color.white, padding: padding.p16 },
  boxTitle: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: color.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: padding.p16,
    paddingTop: padding.p36,
  },
  logo: {
    width: responsivePixel(135),
    height: responsivePixel(100),
  },
  boxLogo: {
    position: 'absolute',
    top: (ScreenHeight / 3 - responsivePixel(100)) / 3,
  },
  imageHeader: {
    flex: 1,
    aspectRatio: responsivePixel(375) / responsivePixel(227),
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
