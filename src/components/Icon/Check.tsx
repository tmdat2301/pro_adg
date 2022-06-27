import React, { FC, memo } from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { MyIconProps, useMyIconUtils } from '@components/Icon/until';

const Check: FC<MyIconProps> = (props) => {
    const { modifyProps } = useMyIconUtils(props);
    return (
        <Svg width="16" height="16" viewBox="0 0 16 16" fill="none" >
            <Rect x="0.5" y="0.5" width="15" height="15" rx="2.5" fill="#0871D3" stroke="#0871D3" />
            <Path d="M6.49995 10.0999L4.39995 7.99993L3.69995 8.69993L6.49995 11.4999L12.5 5.49993L11.8 4.79993L6.49995 10.0999Z" fill="white" />
        </Svg>
    );
};

export default memo(Check);
