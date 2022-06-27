

import React, { FC, memo } from 'react';
import Svg, { Circle, G, Path } from 'react-native-svg';
import { MyIconProps } from '@components/Icon/until';

const Pause: FC<MyIconProps> = (props) => {
    return (
        <Svg width="71" height="71" viewBox="0 0 71 71" fill="none">
            <G>
                <Circle cx="35.5" cy="35.5" r="27" stroke="white" />
            </G>
            <Path d="M26.75 45.7096H32.5833V25.293H26.75V45.7096ZM38.4167 25.293V45.7096H44.25V25.293H38.4167Z" fill="white" />
        </Svg>
    );
};

export default memo(Pause);
