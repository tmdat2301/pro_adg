import React, { FC, memo } from 'react';
import Svg, { Path } from 'react-native-svg';
import { MyIconProps, useMyIconUtils } from '@components/Icon/until';

const Payment: FC<MyIconProps> = (props) => {
  const { modifyProps } = useMyIconUtils(props);
  return (
    <Svg width="18" height="14" viewBox="0 0 18 14" {...modifyProps} fill="none">
      <Path
        d="M15.6667 0.333313H2.33341C1.40841 0.333313 0.675081 1.07498 0.675081 1.99998L0.666748 12C0.666748 12.925 1.40841 13.6666 2.33341 13.6666H15.6667C16.5917 13.6666 17.3334 12.925 17.3334 12V1.99998C17.3334 1.07498 16.5917 0.333313 15.6667 0.333313ZM15.6667 12H2.33341V6.99998H15.6667V12ZM15.6667 3.66665H2.33341V1.99998H15.6667V3.66665Z"
        fill="#9FA2B4"
        {...modifyProps}
      />
    </Svg>
  );
};

export default memo(Payment);
