


import React, { FC, memo } from 'react';
import Svg, { Path, G, Defs, Rect, ClipPath } from 'react-native-svg';
import { MyIconProps, useMyIconUtils } from '@components/Icon/until';
import Color from '@helpers/color';

const DeleteModal: FC<MyIconProps> = (props) => {
    const { modifyProps } = useMyIconUtils(props);
    return (
        <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <G clip-path="url(#clip0_8_1384)">
                <Path
                    d="M3.96261 1.60491H3.85547C3.9144 1.60491 3.96261 1.5567 3.96261 1.49777V1.60491H8.03404V1.49777C8.03404 1.5567 8.08226 1.60491 8.14119 1.60491H8.03404V2.5692H8.99833V1.49777C8.99833 1.025 8.61395 0.640625 8.14119 0.640625H3.85547C3.3827 0.640625 2.99833 1.025 2.99833 1.49777V2.5692H3.96261V1.60491ZM10.7126 2.5692H1.28404C1.04699 2.5692 0.855469 2.76071 0.855469 2.99777V3.42634C0.855469 3.48527 0.903683 3.53348 0.962612 3.53348H1.77154L2.10234 10.5379C2.12377 10.9946 2.50145 11.3549 2.95815 11.3549H9.03851C9.49654 11.3549 9.87288 10.996 9.89431 10.5379L10.2251 3.53348H11.034C11.093 3.53348 11.1412 3.48527 11.1412 3.42634V2.99777C11.1412 2.76071 10.9497 2.5692 10.7126 2.5692ZM8.93538 10.3906H3.06127L2.73717 3.53348H9.25949L8.93538 10.3906Z" fill="#F04545"                    {...modifyProps}
                />
            </G>
            <Defs>
                <ClipPath id="clip0_8_1384">
                    <Rect width="24" height="24" fill="white" />
                </ClipPath>
            </Defs>
        </Svg>
    );
};

export default memo(DeleteModal);
