import type { BaseFieldExtra } from './BaseFieldExtra';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectFieldExtra extends BaseFieldExtra {
  options?: SelectOption[];
}
