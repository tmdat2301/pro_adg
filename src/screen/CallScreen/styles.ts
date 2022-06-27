import color from '@helpers/color';
import fontSize from '@helpers/fontSize';
import padding from '@helpers/padding';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: color.resolutionBlue,
  },
  formIconCall: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  formContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  boxIcon: {
    width: 56,
    height: 56,
    borderRadius: 56,
    borderColor: color.white,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
