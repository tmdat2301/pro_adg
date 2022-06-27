import { padding } from '@helpers/index';
import { StyleSheet } from 'react-native';
import { ScreenWidth } from 'react-native-elements/dist/helpers';

const styles = StyleSheet.create({
  tabContainer: { marginHorizontal: padding.p16, maxWidth: ScreenWidth - 32 },
});

export default styles;
