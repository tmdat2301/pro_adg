import { Dimensions, PixelRatio, Platform } from 'react-native';
import { getStatusBarHeight } from './iphoneXHelper';
import color from './color';
import fontSize from './fontSize';
import padding from './padding';
import * as languageUtils from './languageUtils';

const width = Dimensions.get('window').width;
const scale = width / 375;

const responsivePixel = (size: number) => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const device = {
  height: Dimensions.get('window').height,
  width: Dimensions.get('window').width,
};
const measure = {
  inputHeight: responsivePixel(36),
  buttonHeight: responsivePixel(40),
  buttonHeaderWidth: responsivePixel(36),
  headerHeight: responsivePixel(36),
  bottomTabBarHeight: responsivePixel(57),
  tabBarPaddingBottom: responsivePixel(20),
  iconBtmH: responsivePixel(29),
  cardHeight: responsivePixel(55),
};

const dimension = {
  headerHeight: responsivePixel(55),
};

const statusBar = getStatusBarHeight(true);

const isIos = Platform.OS === 'ios';

export { responsivePixel, device, measure, dimension, statusBar, color, fontSize, padding, languageUtils, isIos };
