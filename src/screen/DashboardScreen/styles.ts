import { color, padding } from '@helpers/index';
import { StyleSheet } from 'react-native';
import { ScreenWidth } from 'react-native-elements/dist/helpers';

export default StyleSheet.create({
  container: { flex: 1 },
  modalHeader: {
    backgroundColor: color.pink,
    width: 70,
    height: 70,
    borderRadius: 35,
    position: 'absolute',
    top: -35,
    left: ScreenWidth / 2 - 35,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
});
