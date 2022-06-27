import { PixelRatio, Dimensions } from 'react-native';
const width = Dimensions.get('window').width;
const scale = width / 375;
const resizeFontsize = (size: number) => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export default {
  f4: resizeFontsize(4),
  f8: resizeFontsize(8),
  f10: resizeFontsize(10),
  f11: resizeFontsize(11),
  f12: resizeFontsize(12),
  f13: resizeFontsize(13),
  f14: resizeFontsize(14),
  f15: resizeFontsize(15),
  f16: resizeFontsize(16),
  f17: resizeFontsize(17),
  f18: resizeFontsize(18),
  f19: resizeFontsize(19),
  f20: resizeFontsize(20),
  f22: resizeFontsize(22),
  f24: resizeFontsize(24),
  f25: resizeFontsize(25),
  f28: resizeFontsize(28),
  f32: resizeFontsize(32),
  f34: resizeFontsize(34),
  f36: resizeFontsize(36),
  f40: resizeFontsize(40),
};
