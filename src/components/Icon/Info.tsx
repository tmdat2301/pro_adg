import React, { FC, memo } from 'react';
import Svg, { Path } from 'react-native-svg';
import { MyIconProps, useMyIconUtils } from '@components/Icon/until';
import Color from '@helpers/color';

const Info: FC<MyIconProps> = (props) => {
  const { modifyProps } = useMyIconUtils(props);
  return (
    <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <Path
        d="M6 0.75C3.10078 0.75 0.75 3.10078 0.75 6C0.75 8.89922 3.10078 11.25 6 11.25C8.89922 11.25 11.25 8.89922 11.25 6C11.25 3.10078 8.89922 0.75 6 0.75ZM6.375 8.53125C6.375 8.58281 6.33281 8.625 6.28125 8.625H5.71875C5.66719 8.625 5.625 8.58281 5.625 8.53125V5.34375C5.625 5.29219 5.66719 5.25 5.71875 5.25H6.28125C6.33281 5.25 6.375 5.29219 6.375 5.34375V8.53125ZM6 4.5C5.8528 4.497 5.71265 4.43641 5.60961 4.33125C5.50658 4.22609 5.44887 4.08473 5.44887 3.9375C5.44887 3.79027 5.50658 3.64891 5.60961 3.54375C5.71265 3.43859 5.8528 3.378 6 3.375C6.1472 3.378 6.28735 3.43859 6.39039 3.54375C6.49342 3.64891 6.55113 3.79027 6.55113 3.9375C6.55113 4.08473 6.49342 4.22609 6.39039 4.33125C6.28735 4.43641 6.1472 4.497 6 4.5Z"
        fill={Color.icon}
        {...modifyProps}
      />
    </Svg>
  );
};

export default memo(Info);
