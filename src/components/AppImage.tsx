import React, { FC, useState } from 'react';
import { color } from '@helpers/index';
import { StyleProp, ActivityIndicator } from 'react-native';
import FastImage, { ImageStyle, ResizeMode, Source, FastImageProps } from 'react-native-fast-image';
import Images from '@assets/images';
import _ from 'lodash';

export interface AppImageProps extends FastImageProps {
  style?: StyleProp<ImageStyle>;
  resizeMode?: ResizeMode;
  source: Source;
  type?: 'avatar' | 'image';
}

const AppImage: FC<AppImageProps> = React.memo((props) => {
  const { source, resizeMode, style, type = 'image', ...restProps } = props;
  const [loading, setLoading] = useState(false);

  if (!!source.uri && _.isEmpty(source)) {
    return (
      <FastImage
        style={props.style}
        source={type === 'avatar' ? Images.avatar : Images.default}
        resizeMode={props.resizeMode ? props.resizeMode : undefined}
        {...restProps}
      />
    );
  }
  return (
    <FastImage
      style={[{ alignItems: 'center', justifyContent: 'center' }, props.style]}
      source={source}
      onLoadStart={() => setLoading(true)}
      onLoadEnd={() => setLoading(false)}
      resizeMode={props.resizeMode ? props.resizeMode : undefined}
      {...restProps}>
      {loading && <ActivityIndicator color={color.primary} />}
    </FastImage>
  );
});

export default AppImage;
