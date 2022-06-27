import color from '@helpers/color';
import fontSize from '@helpers/fontSize';
import padding from '@helpers/padding';
import { StyleSheet } from 'react-native';
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';

export default StyleSheet.create({
  wrapper: {
    backgroundColor: color.white,
    flex: 1,
  },
  containerStyles: {
    backgroundColor: color.lightGray,
    flex: 1,
  },
  labelStyles: {
    color: color.subText,
    fontSize: fontSize.f12,
    paddingBottom: 4,
    flex: 1,
    alignSelf: 'flex-start',
    paddingTop: padding.p12,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleStyles: {
    fontSize: fontSize.f16,
    fontWeight: '500',
  },
  inputStyles: {
    borderBottomWidth: 0.5,
    borderBottomColor: color.gray,
    flexDirection: 'row',
    alignItems: 'center',
  },
  costs: {
    color: color.subText,
    fontSize: fontSize.f12,
    marginRight: padding.p4,
  },
  costStyles: {
    flexDirection: 'row',
    marginTop: padding.p28,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cameraStyles: {
    backgroundColor: color.white,
    shadowOffset: {
      width: 0.3,
      height: 0.4,
    },
    shadowOpacity: 0.1,
    elevation: 3,
    padding: padding.p12,
    borderRadius: 4,
    width: 50,
    height: 50,
    alignItems: 'center',
    marginRight: padding.p8,
  },
  imageStyles: {
    width: 50,
    height: 50,
    marginRight: padding.p8,
  },
  chooseImageContainerStyles: {},
  imagePicker: {
    flexWrap: 'wrap',
    marginTop: padding.p16,
    flexDirection: 'row',
  },
  errorMessage: {
    color: color.red,
    marginTop: padding.p4,
  },
  closeIcon: {
    position: 'absolute',
    zIndex: 999999,
    top: -6,
    right: 0,
  },
  modalImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'black',
    height: ScreenHeight,
  },
  imageViewer: {
    maxHeight: ScreenHeight,
    maxWidth: ScreenWidth,
    zIndex:100
  },
  modalStyles: {
    backgroundColor: color.black,
    justifyContent: 'center',
    flex: 1,
  },
  takePhoto: {
    borderBottomWidth: 0.5,
    borderColor: color.subText,
    flexDirection: 'row',
    padding: padding.p16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    fontSize: fontSize.f16,
    fontWeight: '500',
    marginLeft: padding.p12,
    color: color.dodgerBlue,
  },
  chooseFromLibrary: {
    flexDirection: 'row',
    padding: padding.p16,
  },
  cancelButton: {
    alignItems: 'center',
    marginTop: padding.p16,
    backgroundColor: color.white,
    padding: padding.p16,
    borderRadius: 12,
  },
  modalOptionImage: {
    paddingHorizontal: padding.p8,
    backgroundColor: 'transparent',
  },
  costView: {
    flex: 1,
    backgroundColor: color.white,
    paddingHorizontal: padding.p12,
    marginHorizontal: padding.p16,
    marginBottom: padding.p90,
  },
  header: {
    backgroundColor: color.white,
    marginBottom: padding.p16,
    paddingBottom: padding.p12,
  },
});
