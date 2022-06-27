import React, { FC } from 'react';
import color from '@helpers/color';
import { SpeedDial, SpeedDialProps } from 'react-native-elements/dist/buttons/SpeedDial';
import { IconProps } from 'react-native-elements';

export interface AppSpeedDialProps extends SpeedDialProps {
  iconProps?: IconProps;
  children?: React.ReactChild[];
}

const AppSpeedDial: FC<AppSpeedDialProps> = React.memo((props) => {
  const { iconProps, children, ...restProps } = props;
  const iconTheme = {
    color: color.white,
    type: 'antdesign',
    size: 40,
    style: { margin: -8},
  };

  return (
    <SpeedDial
      color={color.primary}
      icon={{
        ...iconTheme,
        ...iconProps,
        name: 'plus',
      }}
      openIcon={{
        ...iconTheme,
        ...iconProps,
        name: 'close',
      }}
      {...restProps}>
      {children}
    </SpeedDial>
  );
});

export default AppSpeedDial;
