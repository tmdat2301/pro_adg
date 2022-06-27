



import React, { FC, memo } from 'react';
import Svg, { Path } from 'react-native-svg';
import { MyIconProps, useMyIconUtils } from '@components/Icon/until';

const ListAltActivity: FC<MyIconProps> = (props) => {
    const { modifyProps } = useMyIconUtils(props);
    return (
        <Svg width="12" height="12" viewBox="0 0 12 12" {...modifyProps} fill="none">
            <Path d="M5.33333 2.66667H9.33333V4H5.33333V2.66667ZM5.33333 5.33333H9.33333V6.66667H5.33333V5.33333ZM5.33333 8H9.33333V9.33333H5.33333V8ZM2.66667 2.66667H4V4H2.66667V2.66667ZM2.66667 5.33333H4V6.66667H2.66667V5.33333ZM2.66667 8H4V9.33333H2.66667V8ZM11.4 0H0.6C0.266667 0 0 0.266667 0 0.6V11.4C0 11.6667 0.266667 12 0.6 12H11.4C11.6667 12 12 11.6667 12 11.4V0.6C12 0.266667 11.6667 0 11.4 0ZM10.6667 10.6667H1.33333V1.33333H10.6667V10.6667Z" fill="#3B7DE3" />

        </Svg>
    );
};

export default memo(ListAltActivity);
