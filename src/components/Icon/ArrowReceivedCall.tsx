import React, { FC, memo } from 'react';
import Svg, { Path } from 'react-native-svg';
import { MyIconProps, useMyIconUtils } from '@components/Icon/until';

const ArrowReceivedCall: FC<MyIconProps> = (props) => {
  const { modifyProps } = useMyIconUtils(props);
  return (
    <Svg width="19" height="16" viewBox="0 0 19 16" {...modifyProps} fill="none">
      <Path
        d="M17.0299 9.34589L3.58377 9.34589C3.58142 9.34589 3.57908 9.35057 3.58142 9.35057L8.6533 14.2256C9.06345 14.6193 9.07751 15.2732 8.68142 15.6834C8.28767 16.0935 7.63377 16.1076 7.22361 15.7115L0.316578 9.07401C0.115015 8.87948 0.000171661 8.60995 0.000171661 8.33104C0.000171661 8.04979 0.115015 7.78261 0.316578 7.58807L7.26111 0.915418C7.46033 0.72323 7.71814 0.627137 7.97595 0.627137C8.24783 0.627137 8.51736 0.732606 8.71892 0.943543C9.11267 1.3537 9.10095 2.00761 8.6908 2.40136L3.61892 7.27636C3.61658 7.2787 3.61892 7.28104 3.62127 7.28104L17.0533 7.28104C17.6017 7.28104 18.0494 7.70995 18.0822 8.24901C18.1174 8.84901 17.6275 9.34589 17.0299 9.34589Z"
        fill="#34B576"
        {...modifyProps}
      />
    </Svg>
  );
};
export default memo(ArrowReceivedCall);

