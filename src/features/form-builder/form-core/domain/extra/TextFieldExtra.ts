import type { BaseFieldExtra } from './BaseFieldExtra';

export interface Tooltip {
  placement?: 'top' | 'right' | 'bottom' | 'left'
  text?: string;
}

export interface TextFieldExtra extends BaseFieldExtra {
  placeholder?: string;
  tooltip?: Tooltip;
}
