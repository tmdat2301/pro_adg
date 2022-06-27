

import React, { FC, memo } from 'react';
import Svg, { Path, G, Defs, Rect, ClipPath } from 'react-native-svg';
import { MyIconProps, useMyIconUtils } from '@components/Icon/until';
import Color from '@helpers/color';

const MissionModal: FC<MyIconProps> = (props) => {
    const { modifyProps } = useMyIconUtils(props);
    return (
        <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <G clip-path="url(#clip0_8_1384)">
                <Path
                    d="M10.9302 1.60882H8.68025V0.751674C8.68025 0.692746 8.63203 0.644531 8.5731 0.644531H7.8231C7.76417 0.644531 7.71596 0.692746 7.71596 0.751674V1.60882H4.28739V0.751674C4.28739 0.692746 4.23917 0.644531 4.18025 0.644531H3.43025C3.37132 0.644531 3.3231 0.692746 3.3231 0.751674V1.60882H1.0731C0.836049 1.60882 0.644531 1.80033 0.644531 2.03739V10.9302C0.644531 11.1673 0.836049 11.3588 1.0731 11.3588H10.9302C11.1673 11.3588 11.3588 11.1673 11.3588 10.9302V2.03739C11.3588 1.80033 11.1673 1.60882 10.9302 1.60882ZM10.3945 10.3945H1.60882V2.5731H3.3231V3.21596C3.3231 3.27489 3.37132 3.3231 3.43025 3.3231H4.18025C4.23917 3.3231 4.28739 3.27489 4.28739 3.21596V2.5731H7.71596V3.21596C7.71596 3.27489 7.76417 3.3231 7.8231 3.3231H8.5731C8.63203 3.3231 8.68025 3.27489 8.68025 3.21596V2.5731H10.3945V10.3945ZM8.35882 4.76953H7.61953C7.55123 4.76953 7.4856 4.80301 7.44542 4.85792L5.42444 7.64096L4.55792 6.449C4.51775 6.39409 4.45346 6.3606 4.38382 6.3606H3.64453C3.55748 6.3606 3.50658 6.45971 3.55748 6.53069L5.25033 8.86105C5.27035 8.88845 5.29655 8.91073 5.32681 8.9261C5.35706 8.94146 5.39051 8.94947 5.42444 8.94947C5.45837 8.94947 5.49182 8.94146 5.52208 8.9261C5.55233 8.91073 5.57853 8.88845 5.59855 8.86105L8.44587 4.94096C8.49676 4.86864 8.44587 4.76953 8.35882 4.76953Z" fill="#9FA2B4"                    {...modifyProps}
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

export default memo(MissionModal);