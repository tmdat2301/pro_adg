import React, { FC, memo } from 'react';
import Svg, { Path } from 'react-native-svg';
import { MyIconProps, useMyIconUtils } from '@components/Icon/until';

const ArrowMissedCallaway: FC<MyIconProps> = (props) => {
  const { modifyProps } = useMyIconUtils(props);
  return (
    <Svg width="19" height="16" viewBox="0 0 19 16" {...modifyProps} fill="none">
      <Path
        d="M0 1.25333L8 9.25333L14.2222 3.03111V7.11111H16V0H8.88889V1.77778H12.9689L8 6.74667L1.25333 0L0 1.25333Z"
        fill="#E82037"
        {...modifyProps}
      />
    </Svg>
  );
};

export default memo(ArrowMissedCallaway);
