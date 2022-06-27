

import React, { FC, memo } from 'react';
import Svg, { Circle, G, Path } from 'react-native-svg';
import { MyIconProps } from '@components/Icon/until';

const Speakerphone: FC<MyIconProps> = (props) => {
    return (
        <Svg width="71" height="71" viewBox="0 0 71 71" fill="none">
            <Path d="M22.375 31.1255V39.8755H28.2083L35.5 47.1672V23.8339L28.2083 31.1255H22.375ZM42.0625 35.5005C42.0625 32.9193 40.575 30.7026 38.4167 29.6234V41.363C40.575 40.2984 42.0625 38.0818 42.0625 35.5005ZM38.4167 22.7109V25.7151C42.6313 26.9693 45.7083 30.8776 45.7083 35.5005C45.7083 40.1234 42.6313 44.0318 38.4167 45.2859V48.2901C44.2646 46.963 48.625 41.7422 48.625 35.5005C48.625 29.2589 44.2646 24.038 38.4167 22.7109V22.7109Z" fill="white" />
            <G>
                <Circle cx="35.5" cy="35.5" r="27" stroke="white" />
            </G>
        </Svg>
    );
};

export default memo(Speakerphone);
