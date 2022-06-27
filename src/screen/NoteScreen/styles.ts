import { StyleSheet } from 'react-native';
import { color, padding, fontSize } from '@helpers/index';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import { screenHeight } from 'react-native-calendars/src/expandableCalendar/commons';
export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.white,
    marginHorizontal: ScreenWidth * 0.14,
    width: ScreenWidth * 0.72,
    minHeight: 200,
    maxHeight: 250,
    top: screenHeight * 0.3,
    borderRadius: padding.p8,
    right: 0,
    left: 0,
    bottom: 0,
    zIndex: 999,
  },
  viewOneBtn: {
    width: '100%',
    alignItems: 'center',
    height: 50,
  },
  viewTwoBtn: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    height: 50,
  },
  childBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  lineVSepe: {
    width: 1,
    height: '100%',
    backgroundColor: color.hawkesBlue,
  },
  lineHSepe: {
    width: '100%',
    height: 1,
    backgroundColor: color.hawkesBlue,
  },
  viewInput: {
    alignItems: 'flex-start',
    fontSize: fontSize.f14,
    borderWidth: 0,
    borderColor: 'transparent',
    textAlignVertical: 'top',
  },
  containerInput: { borderWidth: 0, borderColor: 'transparent' },
  viewTitle: {
    paddingTop: padding.p20,
  },
  modalTouch: {
    flex: 1,
    backgroundColor: color.black60,
    zIndex: 10,
  },
  iconClock: {
    marginHorizontal: padding.p8,
  },
  contentOwned: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: padding.p16,
    marginVertical: padding.p8,
    width: ScreenWidth * 0.72 - 32,
  },
});
