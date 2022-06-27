import React, { FC, memo } from 'react';
import Svg, { Path } from 'react-native-svg';
import { MyIconProps, useMyIconUtils } from '@components/Icon/until';

const ArrowMissedCall: FC<MyIconProps> = (props) => {
  const { modifyProps } = useMyIconUtils(props);
  return (
    <Svg width="18" height="11" viewBox="0 0 18 11" {...modifyProps} fill="none">
      <Path
        d="M16.59 0L9 7.59L3.41 2H8V0H0V8H2V3.41L9 10.41L18 1.41L16.59 0Z" fill="#E82037"
        {...modifyProps}
      />
    </Svg>
  );

};

export default memo(ArrowMissedCall);
