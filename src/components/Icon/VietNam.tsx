import React, { FC, memo } from 'react';
import Svg, { Path } from 'react-native-svg';
import { MyIconProps, useMyIconUtils } from '@components/Icon/until';

const VietNam: FC<MyIconProps> = (props) => {
  const { modifyProps } = useMyIconUtils(props);
  return (
    <Svg width="26" height="18" viewBox="0 0 26 18" {...modifyProps} fill="none">
      <Path d="M0.166504 0.25H25.8332V17.75H0.166504V0.25Z" fill="#D32F2F" {...modifyProps} />
      <Path
        d="M14.7813 9.92901L17.6653 7.83371H14.1006L12.9987 4.44336L11.8968 7.83371H8.33203L11.216 9.92901L10.1147 13.3199L12.9987 11.224L15.8827 13.3199L14.7813 9.92901Z"
        fill="#FFEB3B"
      />
    </Svg>
  );
};

export default memo(VietNam);
