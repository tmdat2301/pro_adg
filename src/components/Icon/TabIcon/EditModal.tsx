

import React, { FC, memo } from 'react';
import Svg, { Path, G, Defs, Rect, ClipPath } from 'react-native-svg';
import { MyIconProps, useMyIconUtils } from '@components/Icon/until';
import Color from '@helpers/color';

const EditModal: FC<MyIconProps> = (props) => {
    const { modifyProps } = useMyIconUtils(props);
    return (
        <Svg width="12" height="12" viewBox="0 0 12 12" fill="none" >
            <G clip-path="url(#clip0_8_1384)">
                <Path
                    d="M2.59587 9.21206C2.62266 9.21206 2.64944 9.20938 2.67623 9.20536L4.92891 8.81027C4.95569 8.80491 4.98114 8.79286 4.99989 8.77277L10.6771 3.09554C10.6895 3.08315 10.6994 3.06843 10.7061 3.05223C10.7128 3.03603 10.7163 3.01866 10.7163 3.00112C10.7163 2.98358 10.7128 2.96621 10.7061 2.95001C10.6994 2.9338 10.6895 2.91909 10.6771 2.9067L8.45123 0.679464C8.42578 0.654018 8.3923 0.640625 8.35614 0.640625C8.31998 0.640625 8.2865 0.654018 8.26105 0.679464L2.58382 6.3567C2.56373 6.37679 2.55167 6.40089 2.54632 6.42768L2.15123 8.68036C2.1382 8.75211 2.14285 8.82595 2.16479 8.89549C2.18673 8.96503 2.22528 9.02818 2.27712 9.07947C2.36551 9.16518 2.47667 9.21206 2.59587 9.21206ZM3.49855 6.87634L8.35614 2.02009L9.33783 3.00179L4.48025 7.85804L3.28962 8.06831L3.49855 6.87634ZM10.9302 10.3371H1.0731C0.836049 10.3371 0.644531 10.5286 0.644531 10.7656V11.2478C0.644531 11.3067 0.692746 11.3549 0.751674 11.3549H11.2517C11.3106 11.3549 11.3588 11.3067 11.3588 11.2478V10.7656C11.3588 10.5286 11.1673 10.3371 10.9302 10.3371Z" fill="#9FA2B4"                    {...modifyProps}
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

export default memo(EditModal);
