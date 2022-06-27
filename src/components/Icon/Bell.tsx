import React, { FC, memo } from 'react';
import Svg, { Path } from 'react-native-svg';
import { MyIconProps, useMyIconUtils } from '@components/Icon/until';

const Bell: FC<MyIconProps> = (props) => {
  const { modifyProps } = useMyIconUtils(props);
  return (
    <Svg width="22" height="20" viewBox="0 0 22 20" {...modifyProps} fill="none">
      <Path
        d="M17.5312 15H17.0156V8.35938C17.0156 5.60352 14.7748 3.32422 11.8594 2.94531V2.1875C11.8594 1.75586 11.4748 1.40625 11 1.40625C10.5252 1.40625 10.1406 1.75586 10.1406 2.1875V2.94531C7.2252 3.32422 4.98438 5.60352 4.98438 8.35938V15H4.46875C4.08848 15 3.78125 15.2793 3.78125 15.625V16.25C3.78125 16.3359 3.85859 16.4062 3.95312 16.4062H8.59375C8.59375 17.6133 9.67227 18.5938 11 18.5938C12.3277 18.5938 13.4062 17.6133 13.4062 16.4062H18.0469C18.1414 16.4062 18.2188 16.3359 18.2188 16.25V15.625C18.2188 15.2793 17.9115 15 17.5312 15ZM11 17.3438C10.4307 17.3438 9.96875 16.9238 9.96875 16.4062H12.0312C12.0312 16.9238 11.5693 17.3438 11 17.3438Z"
        fill="white"
        {...modifyProps}
      />
    </Svg>
  );
};

export default memo(Bell);
