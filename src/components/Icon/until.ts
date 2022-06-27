import { SvgProps } from 'react-native-svg';

export interface MyIconProps extends SvgProps {
  size?: number;
  scale?: number;
}

export function useMyIconUtils(props: MyIconProps) {
  const { size, scale } = props;
  const modifyProps: Partial<MyIconProps> = { ...props };

  if (size) {
    modifyProps.height = size;
    modifyProps.width = size;
  }

  if (scale) {
    modifyProps.height = (Number(modifyProps?.height) || 0) * scale;
    modifyProps.width = (Number(modifyProps?.width) || 0) * scale;
  }

  return { modifyProps };
}
