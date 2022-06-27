import React, { FC, memo } from 'react';
import Svg, { Path } from 'react-native-svg';
import { MyIconProps, useMyIconUtils } from '@components/Icon/until';
import Color from '@helpers/color';

const ArrowUp: FC<MyIconProps> = (props) => {
  const { modifyProps } = useMyIconUtils(props);
  return (
    <Svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <Path
        d="M9.76821 5.44818L5.32312 0.325408C5.28294 0.279054 5.23326 0.241878 5.17746 0.216399C5.12166 0.190921 5.06103 0.177734 4.99968 0.177734C4.93834 0.177734 4.87771 0.190921 4.82191 0.216399C4.7661 0.241878 4.71643 0.279054 4.67625 0.325408L0.232496 5.44818C0.219068 5.46362 0.210361 5.48259 0.207413 5.50284C0.204464 5.52309 0.207399 5.54376 0.215866 5.56239C0.224334 5.58102 0.237978 5.59682 0.255173 5.60792C0.272368 5.61901 0.29239 5.62493 0.312853 5.62496H1.39767C1.45928 5.62496 1.51821 5.59818 1.55973 5.5513L4.49142 2.17228V9.7138C4.49142 9.77273 4.53964 9.82095 4.59857 9.82095H5.40214C5.46107 9.82095 5.50928 9.77273 5.50928 9.7138V2.17228L8.44098 5.5513C8.48116 5.59818 8.54008 5.62496 8.60303 5.62496H9.68785C9.77892 5.62496 9.82848 5.51782 9.76821 5.44818Z"
        fill={Color.icon}
        {...modifyProps}
      />
    </Svg>
  );
};

export default memo(ArrowUp);