import React, { FC, memo } from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { MyIconProps, useMyIconUtils } from '@components/Icon/until';

const IconStatus: FC<MyIconProps> = (props) => {
    const { modifyProps } = useMyIconUtils(props);
    return (
        <Svg width="6" height="6" viewBox="0 0 6 6" fill="none">
            <Circle
                cx="3" cy="3" r="3" fill="#FFBB00"
                {...modifyProps}
            />
        </Svg>
    );
};

export default memo(IconStatus);
