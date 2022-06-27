import React, { FC, memo } from 'react';
import Svg, { Path } from 'react-native-svg';
import { MyIconProps, useMyIconUtils } from '@components/Icon/until';
import Color from '@helpers/color';

const Dashboard: FC<MyIconProps> = (props) => {
  const { modifyProps } = useMyIconUtils(props);
  return (
    <Svg width="24" height="22" viewBox="0 0 24 22" fill="none">
      <Path
        d="M23.0571 7.61751C22.4548 6.19173 21.5815 4.89637 20.4857 3.80323C19.3926 2.70745 18.0972 1.83417 16.6714 1.2318C15.1902 0.605012 13.6205 0.28894 12 0.28894C10.3795 0.28894 8.80982 0.605012 7.32857 1.2318C5.90279 1.83417 4.60743 2.70745 3.51429 3.80323C2.4185 4.89637 1.54523 6.19173 0.942857 7.61751C0.316071 9.09876 0 10.6684 0 12.2889C0 15.8434 1.56161 19.1916 4.28304 21.4791L4.32857 21.5166C4.48393 21.6452 4.67946 21.7175 4.88036 21.7175H19.1223C19.3232 21.7175 19.5187 21.6452 19.6741 21.5166L19.7196 21.4791C22.4384 19.1916 24 15.8434 24 12.2889C24 10.6684 23.6812 9.09876 23.0571 7.61751ZM18.6804 19.6818H5.31964C4.28463 18.7486 3.45741 17.6081 2.89167 16.3345C2.32593 15.0609 2.0343 13.6826 2.03571 12.2889C2.03571 9.62644 3.07232 7.12466 4.95536 5.2443C6.83839 3.36126 9.34018 2.32465 12 2.32465C14.6625 2.32465 17.1643 3.36126 19.0446 5.2443C20.9277 7.12733 21.9643 9.62912 21.9643 12.2889C21.9643 15.1175 20.7723 17.7934 18.6804 19.6818ZM14.9866 8.57912C14.9463 8.53924 14.8919 8.51687 14.8353 8.51687C14.7786 8.51687 14.7242 8.53924 14.6839 8.57912L12.4205 10.8425C11.9196 10.7086 11.3652 10.8372 10.9714 11.2309C10.832 11.3701 10.7213 11.5354 10.6458 11.7175C10.5703 11.8995 10.5315 12.0946 10.5315 12.2916C10.5315 12.4887 10.5703 12.6838 10.6458 12.8658C10.7213 13.0478 10.832 13.2131 10.9714 13.3523C11.1106 13.4918 11.276 13.6024 11.458 13.6779C11.64 13.7534 11.8351 13.7923 12.0321 13.7923C12.2292 13.7923 12.4243 13.7534 12.6063 13.6779C12.7883 13.6024 12.9537 13.4918 13.0929 13.3523C13.2794 13.1663 13.4136 12.9344 13.4818 12.68C13.55 12.4255 13.5498 12.1576 13.4812 11.9032L15.7446 9.63983C15.8277 9.5568 15.8277 9.42019 15.7446 9.33716L14.9866 8.57912ZM11.4107 5.86037H12.5893C12.7071 5.86037 12.8036 5.76394 12.8036 5.64608V3.50323C12.8036 3.38537 12.7071 3.28894 12.5893 3.28894H11.4107C11.2929 3.28894 11.1964 3.38537 11.1964 3.50323V5.64608C11.1964 5.76394 11.2929 5.86037 11.4107 5.86037ZM18.375 11.6997V12.8782C18.375 12.9961 18.4714 13.0925 18.5893 13.0925H20.7321C20.85 13.0925 20.9464 12.9961 20.9464 12.8782V11.6997C20.9464 11.5818 20.85 11.4854 20.7321 11.4854H18.5893C18.4714 11.4854 18.375 11.5818 18.375 11.6997ZM18.7152 6.41751L17.8821 5.58448C17.8419 5.5446 17.7875 5.52223 17.7308 5.52223C17.6741 5.52223 17.6197 5.5446 17.5795 5.58448L16.0634 7.10055C16.0235 7.14082 16.0011 7.19521 16.0011 7.25189C16.0011 7.30857 16.0235 7.36295 16.0634 7.40323L16.8964 8.23626C16.9795 8.3193 17.1161 8.3193 17.1991 8.23626L18.7152 6.72019C18.7982 6.63716 18.7982 6.50055 18.7152 6.41751ZM6.43125 5.58448C6.39098 5.5446 6.33659 5.52223 6.27991 5.52223C6.22323 5.52223 6.16885 5.5446 6.12857 5.58448L5.29554 6.41751C5.25566 6.45779 5.23329 6.51217 5.23329 6.56885C5.23329 6.62553 5.25566 6.67992 5.29554 6.72019L6.81161 8.23626C6.89464 8.3193 7.03125 8.3193 7.11429 8.23626L7.94732 7.40323C8.03036 7.32019 8.03036 7.18358 7.94732 7.10055L6.43125 5.58448ZM5.30357 11.4854H3.16071C3.04286 11.4854 2.94643 11.5818 2.94643 11.6997V12.8782C2.94643 12.9961 3.04286 13.0925 3.16071 13.0925H5.30357C5.42143 13.0925 5.51786 12.9961 5.51786 12.8782V11.6997C5.51786 11.5818 5.42143 11.4854 5.30357 11.4854Z"
        fill={Color.icon}
        {...modifyProps}
      />
    </Svg>
  );
};

export default memo(Dashboard);