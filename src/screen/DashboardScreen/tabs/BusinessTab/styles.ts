import { padding } from '@helpers/index';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  tabContainer: { marginHorizontal: padding.p16 },
  viewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: padding.p16,
    justifyContent: 'space-around',
    width: '100%',
    flex: 1,
    paddingBottom: 100,
  },
});

export default styles;
