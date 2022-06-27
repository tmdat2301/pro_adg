


import React, { FC, memo } from 'react';
import Svg, { Circle, G, Path } from 'react-native-svg';
import { MyIconProps } from '@components/Icon/until';

const Mute: FC<MyIconProps> = (props) => {
    return (
        <Svg width="71" height="71" viewBox="0 0 71 71" fill="none">
            <G>
                <Circle cx="35.5" cy="35.5" r="27" stroke="white" />
            </G>
            <Path
                d="M35.4993 39.875C37.9202 39.875 39.8598 37.9208 39.8598 35.5L39.8743 26.75C39.8743 24.3292 37.9202 22.375 35.4993 22.375C33.0785 22.375 31.1243 24.3292 31.1243 26.75V35.5C31.1243 37.9208 33.0785 39.875 35.4993 39.875ZM43.2285 35.5C43.2285 39.875 39.5243 42.9375 35.4993 42.9375C31.4743 42.9375 27.7702 39.875 27.7702 35.5H25.291C25.291 40.4875 29.2577 44.5854 34.041 45.3V50.0833H36.9577V45.3C41.741 44.6 45.7077 40.4875 45.7077 35.5H43.2285Z" fill="white"
            />
        </Svg>
    );
};

export default memo(Mute);
