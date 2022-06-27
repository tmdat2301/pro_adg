
import React, { FC, memo } from 'react';
import Svg, { Path } from 'react-native-svg';
import { MyIconProps, useMyIconUtils } from '@components/Icon/until';

const Phone: FC<MyIconProps> = (props) => {
    const { modifyProps } = useMyIconUtils(props);
    return (
        <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <Path
                d="M10.8181 8.17448L9.12474 7.98115C8.71807 7.93448 8.31807 8.07448 8.03141 8.36115L6.80474 9.58781C4.91807 8.62781 3.37141 7.08781 2.41141 5.19448L3.64474 3.96115C3.93141 3.67448 4.07141 3.27448 4.02474 2.86781L3.83141 1.18781C3.75141 0.514479 3.18474 0.0078125 2.50474 0.0078125H1.35141C0.598074 0.0078125 -0.0285927 0.634479 0.018074 1.38781C0.371407 7.08115 4.92474 11.6278 10.6114 11.9811C11.3647 12.0278 11.9914 11.4011 11.9914 10.6478V9.49448C11.9981 8.82115 11.4914 8.25448 10.8181 8.17448Z" fill="#3B7DE3"
                {...modifyProps}
            />
        </Svg>
    );
};

export default memo(Phone);
