
import React, { FC, memo } from 'react';
import Svg, { Path } from 'react-native-svg';
import { MyIconProps, useMyIconUtils } from '@components/Icon/until';

const TickModal: FC<MyIconProps> = (props) => {
    const { modifyProps } = useMyIconUtils(props);
    return (
        <Svg width="10" height="8" viewBox="0 0 10 8" fill="none" >
            <Path
                d="M3.49997 6.09993L1.39997 3.99993L0.699966 4.69993L3.49997 7.49993L9.49997 1.49993L8.79997 0.799927L3.49997 6.09993Z" fill="#0871D3"
                {...modifyProps}
            />
        </Svg>
    );
};

export default memo(TickModal);
