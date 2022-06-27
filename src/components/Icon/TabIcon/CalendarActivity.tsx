


import React, { FC, memo } from 'react';
import Svg, { Path } from 'react-native-svg';
import { MyIconProps, useMyIconUtils } from '@components/Icon/until';

const CalendarActivity: FC<MyIconProps> = (props) => {
    const { modifyProps } = useMyIconUtils(props);
    return (
        <Svg width="16" height="18" viewBox="0 0 16 18" {...modifyProps} fill="none">
            <Path
                d="M11.3333 9.83464H8.83333C8.375 9.83464 8 10.2096 8 10.668V13.168C8 13.6263 8.375 14.0013 8.83333 14.0013H11.3333C11.7917 14.0013 12.1667 13.6263 12.1667 13.168V10.668C12.1667 10.2096 11.7917 9.83464 11.3333 9.83464ZM11.3333 1.5013V2.33464H4.66667V1.5013C4.66667 1.04297 4.29167 0.667969 3.83333 0.667969C3.375 0.667969 3 1.04297 3 1.5013V2.33464H2.16667C1.24167 2.33464 0.508333 3.08464 0.508333 4.0013L0.5 15.668C0.5 16.5846 1.24167 17.3346 2.16667 17.3346H13.8333C14.75 17.3346 15.5 16.5846 15.5 15.668V4.0013C15.5 3.08464 14.75 2.33464 13.8333 2.33464H13V1.5013C13 1.04297 12.625 0.667969 12.1667 0.667969C11.7083 0.667969 11.3333 1.04297 11.3333 1.5013ZM13 15.668H3C2.54167 15.668 2.16667 15.293 2.16667 14.8346V6.5013H13.8333V14.8346C13.8333 15.293 13.4583 15.668 13 15.668Z" fill="#3B7DE3"                               {...modifyProps}
            />
        </Svg>
    );
};

export default memo(CalendarActivity);
