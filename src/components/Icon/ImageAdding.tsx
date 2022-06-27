import React, { FC, memo } from 'react';
import Svg, { Path, G, Defs, Rect, ClipPath } from 'react-native-svg';
import { MyIconProps, useMyIconUtils } from '@components/Icon/until';
import Color from '@helpers/color';

const ImageAdding: FC<MyIconProps> = (props) => {
  const { modifyProps } = useMyIconUtils(props);
  return (
    <Svg width="24" height="22" viewBox="0 0 24 22" {...modifyProps} fill="none">
      <G clip-path="url(#clip0_8_1384)">
        <Path
          d="M3.125 3.16699V0.0419922H5.20833V3.16699H8.33333V5.25033H5.20833V8.37533H3.125V5.25033H0V3.16699H3.125ZM6.25 9.41699V6.29199H9.375V3.16699H16.6667L18.5729 5.25033H21.875C23.0208 5.25033 23.9583 6.18783 23.9583 7.33366V19.8337C23.9583 20.9795 23.0208 21.917 21.875 21.917H5.20833C4.0625 21.917 3.125 20.9795 3.125 19.8337V9.41699H6.25ZM13.5417 18.792C16.4167 18.792 18.75 16.4587 18.75 13.5837C18.75 10.7087 16.4167 8.37533 13.5417 8.37533C10.6667 8.37533 8.33333 10.7087 8.33333 13.5837C8.33333 16.4587 10.6667 18.792 13.5417 18.792ZM10.2083 13.5837C10.2083 15.4274 11.6979 16.917 13.5417 16.917C15.3854 16.917 16.875 15.4274 16.875 13.5837C16.875 11.7399 15.3854 10.2503 13.5417 10.2503C11.6979 10.2503 10.2083 11.7399 10.2083 13.5837Z"
          fill={Color.icon}
          {...modifyProps}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_8_1384">
          <Rect width="24" height="24" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default memo(ImageAdding);

