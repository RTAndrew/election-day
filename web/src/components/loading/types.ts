import type { SpinProps } from 'antd';

export type LoadingSize = 'small' | 'middle' | 'large' | 'default' | number;

export interface LoadingProps extends Omit<SpinProps, 'size' | 'indicator'> {
  size?: LoadingSize;
  color?: string;
  fullWidth?: boolean;
}
