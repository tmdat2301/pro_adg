import { PixelRatio, Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const scale = width / 375;

const responsivePadding = (size: number) => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export default {
  p0: responsivePadding(0),
  p1: responsivePadding(1),
  p2: responsivePadding(2),
  p3: responsivePadding(3),
  p4: responsivePadding(4),
  p5: responsivePadding(5),
  p6: responsivePadding(6),
  p8: responsivePadding(8),
  p9: responsivePadding(9),
  p10: responsivePadding(10),
  p12: responsivePadding(12),
  p14: responsivePadding(14),
  p16: responsivePadding(16),
  p13: responsivePadding(13),
  p15: responsivePadding(15),
  p18: responsivePadding(18),
  p19: responsivePadding(19),
  p20: responsivePadding(20),
  p24: responsivePadding(24),
  p26: responsivePadding(26),
  p28: responsivePadding(28),
  p30: responsivePadding(30),
  p32: responsivePadding(32),
  p36: responsivePadding(36),
  p38: responsivePadding(38),
  p40: responsivePadding(40),
  p42: responsivePadding(42),
  p44: responsivePadding(44),
  p48: responsivePadding(48),
  p50: responsivePadding(50),
  p52: responsivePadding(52),
  p60: responsivePadding(60),
  p66: responsivePadding(66),
  p90: responsivePadding(90),
  p100: responsivePadding(100),
};
