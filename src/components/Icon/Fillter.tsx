
import React, { FC, memo } from 'react';
import Svg, { Path } from 'react-native-svg';
import { MyIconProps, useMyIconUtils } from '@components/Icon/until';

const Fillter: FC<MyIconProps> = (props) => {
    const { modifyProps } = useMyIconUtils(props);
    return (
        <Svg width="16" height="15" viewBox="0 0 16 15" fill="none">
            <Path
                d="M15.3622 0H0.636888C0.146843 0 -0.159185 0.534049 0.0868377 0.960088L4.73926 8.86881V13.6813C4.73926 14.0353 5.02329 14.3213 5.37532 14.3213H10.6238C10.9758 14.3213 11.2599 14.0353 11.2599 13.6813V8.86881L15.9143 0.960088C16.1583 0.534049 15.8523 0 15.3622 0ZM9.82773 12.8812H6.1714V9.76089H9.82973V12.8812H9.82773ZM10.0197 8.14875L9.82973 8.48078H6.1694L5.97938 8.14875L2.01301 1.44013H13.9861L10.0197 8.14875Z" fill="#9FA2B4"
                {...modifyProps}
            />
        </Svg>
    );
};

export default memo(Fillter);
