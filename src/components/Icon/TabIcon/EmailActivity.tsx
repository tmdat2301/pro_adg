

import React, { FC, memo } from 'react';
import Svg, { Path } from 'react-native-svg';
import { MyIconProps, useMyIconUtils } from '@components/Icon/until';

const EmailActivity: FC<MyIconProps> = (props) => {
    const { modifyProps } = useMyIconUtils(props);
    return (
        <Svg width="14" height="12" viewBox="0 0 14 12" fill="none">
            <Path
                d="M13.6654 2.0013C13.6654 1.26797 13.0654 0.667969 12.332 0.667969H1.66536C0.932031 0.667969 0.332031 1.26797 0.332031 2.0013V10.0013C0.332031 10.7346 0.932031 11.3346 1.66536 11.3346H12.332C13.0654 11.3346 13.6654 10.7346 13.6654 10.0013V2.0013ZM12.332 2.0013L6.9987 5.33464L1.66536 2.0013H12.332ZM12.332 10.0013H1.66536V3.33464L6.9987 6.66797L12.332 3.33464V10.0013Z" fill="#3B7DE3"                {...modifyProps}
            />
        </Svg>
    );
};

export default memo(EmailActivity);
