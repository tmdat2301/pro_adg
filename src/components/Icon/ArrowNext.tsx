import React, { FC, memo } from 'react';
import Svg, { Path } from 'react-native-svg';
import { MyIconProps, useMyIconUtils } from '@components/Icon/until';
import Color from '@helpers/color';

const ArrowNext: FC<MyIconProps> = (props) => {
  const { modifyProps } = useMyIconUtils(props);
  return (
    <Svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <Path
        d="M7.83147 4.71901L2.80022 0.789324C2.78708 0.778974 2.77128 0.772542 2.75464 0.770766C2.738 0.76899 2.7212 0.771944 2.70617 0.779286C2.69113 0.786629 2.67847 0.798063 2.66964 0.812276C2.66081 0.826489 2.65617 0.842904 2.65625 0.859637V1.72236C2.65625 1.77705 2.68192 1.8295 2.72433 1.86298L6.74219 5.00026L2.72433 8.13754C2.6808 8.17102 2.65625 8.22348 2.65625 8.27816V9.14089C2.65625 9.21566 2.74219 9.25696 2.80022 9.2112L7.83147 5.28151C7.87424 5.24816 7.90883 5.20549 7.93262 5.15675C7.95642 5.10802 7.96878 5.0545 7.96878 5.00026C7.96878 4.94603 7.95642 4.89251 7.93262 4.84377C7.90883 4.79504 7.87424 4.75237 7.83147 4.71901Z"
        fill={Color.icon}
        {...modifyProps}
      />
    </Svg>
  );
};

export default memo(ArrowNext);
