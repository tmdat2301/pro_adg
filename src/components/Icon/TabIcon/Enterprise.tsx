import React, { FC, memo } from 'react';
import Svg, { Path, G, Defs, Rect, ClipPath } from 'react-native-svg';
import { MyIconProps, useMyIconUtils } from '@components/Icon/until';
import { color } from '@helpers/index';

const Enterprise: FC<MyIconProps> = (props) => {
  const { modifyProps } = useMyIconUtils(props);
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" {...modifyProps} fill="none">
      <G clip-path="url(#clip0_8_1380)">
        <Path
          d="M23.6398 11.811L13.2898 1.46631L12.5961 0.772562C12.438 0.615535 12.2243 0.527405 12.0014 0.527405C11.7786 0.527405 11.5649 0.615535 11.4068 0.772562L0.363057 11.811C0.201087 11.9723 0.0730793 12.1644 -0.0134101 12.3761C-0.0998995 12.5877 -0.143118 12.8145 -0.140514 13.0431C-0.1298 13.986 0.655022 14.7386 1.59788 14.7386H2.73627V23.4627H21.2666V14.7386H22.4291C22.8872 14.7386 23.3184 14.5592 23.6425 14.2351C23.8021 14.076 23.9286 13.8868 24.0145 13.6785C24.1005 13.4703 24.1443 13.247 24.1434 13.0217C24.1434 12.5663 23.9639 12.1351 23.6398 11.811ZM13.5014 21.5342H10.5014V16.0699H13.5014V21.5342ZM19.3381 12.8101V21.5342H15.2157V15.427C15.2157 14.8351 14.7363 14.3556 14.1443 14.3556H9.85859C9.26663 14.3556 8.78716 14.8351 8.78716 15.427V21.5342H4.66484V12.8101H2.09341L12.0041 2.90738L12.6229 3.52613L21.9122 12.8101H19.3381Z"
          fill={color.icon}
          {...modifyProps}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_8_1380">
          <Rect width="24" height="24" fill="white"  />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default memo(Enterprise);
