import React, { FC, memo } from 'react';
import Svg, { Path } from 'react-native-svg';
import { MyIconProps, useMyIconUtils } from '@components/Icon/until';

const Profile: FC<MyIconProps> = (props) => {
  const { modifyProps } = useMyIconUtils(props);
  return (
    <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <Path
        d="M9.00008 0.666687C4.40008 0.666687 0.666748 4.40002 0.666748 9.00002C0.666748 13.6 4.40008 17.3334 9.00008 17.3334C13.6001 17.3334 17.3334 13.6 17.3334 9.00002C17.3334 4.40002 13.6001 0.666687 9.00008 0.666687ZM9.00008 3.16669C10.3834 3.16669 11.5001 4.28335 11.5001 5.66669C11.5001 7.05002 10.3834 8.16669 9.00008 8.16669C7.61675 8.16669 6.50008 7.05002 6.50008 5.66669C6.50008 4.28335 7.61675 3.16669 9.00008 3.16669ZM9.00008 15C6.91675 15 5.07508 13.9334 4.00008 12.3167C4.02508 10.6584 7.33342 9.75002 9.00008 9.75002C10.6584 9.75002 13.9751 10.6584 14.0001 12.3167C12.9251 13.9334 11.0834 15 9.00008 15Z"
        fill="#9FA2B4"
        {...modifyProps}
      />
    </Svg>
  );
};

export default memo(Profile);
