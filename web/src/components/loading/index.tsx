import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

import type { LoadingProps, LoadingSize } from './types';
import styles from './styles.module.css';

const SIZES_MAP: Record<LoadingSize | string, number> = {
  small: 16,
  middle: 30,
  large: 48,
  default: 20,
};

interface IGetSpinnerSize {
  size: LoadingSize;
  fullscreen?: boolean;
  fullWidth?: boolean;
}

const getSpinnerSize = ({ size, fullscreen, fullWidth }: IGetSpinnerSize): number => {
  if (typeof size === 'number') return size;
  if (fullscreen) return SIZES_MAP['large'];
  if (fullWidth) return SIZES_MAP['middle'];

  return SIZES_MAP[size] || SIZES_MAP['default'];
};

const Loading = ({ size = 'default', color, fullWidth, fullscreen, ...rest }: LoadingProps) => {
  const className = [
    styles.spinner,
    fullWidth && styles.fullWidth,
    fullscreen && styles.fullscreen,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Spin
      className={className}
      indicator={
        <LoadingOutlined
          style={{ fontSize: getSpinnerSize({ fullscreen, size, fullWidth }), color }}
          spin
        />
      }
      {...rest}
    />
  );
};

export default Loading;
