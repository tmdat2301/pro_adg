import React, { FC, memo } from 'react';
import Svg, { Path } from 'react-native-svg';
import { MyIconProps, useMyIconUtils } from '@components/Icon/until';
import Color from '@helpers/color';

const DropDown: FC<MyIconProps> = (props) => {
  const { modifyProps } = useMyIconUtils(props);
  return (
    <Svg width="7" height="5" viewBox="0 0 7 5" fill="none">
      <Path
        d="M6.76521 0H0.234792C0.0389193 0 -0.0704512 0.20681 0.0508507 0.347997L3.31606 4.13421C3.40952 4.24258 3.58948 4.24258 3.68394 4.13421L6.94915 0.347997C7.07045 0.20681 6.96108 0 6.76521 0Z"
        fill={Color.primary}
        {...modifyProps}
      />
    </Svg>
  );
};

export default memo(DropDown);
