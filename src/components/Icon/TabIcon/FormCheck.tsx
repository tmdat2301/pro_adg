import React, { FC, memo } from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { MyIconProps, useMyIconUtils } from '@components/Icon/until';

const FormCheck: FC<MyIconProps> = (props) => {
    const { modifyProps } = useMyIconUtils(props);
    return (
        <Svg width="16" height="16" viewBox="0 0 16 16" fill="none" >
            <Rect x="0.5" y="0.5" width="15" height="15" rx="2.5" stroke="#D8DDE6" stroke-opacity="0.6" />
        </Svg>
    );
};

export default memo(FormCheck);
