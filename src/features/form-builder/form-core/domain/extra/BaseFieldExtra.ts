import type { InputActionMeta } from 'react-select';

export interface FieldUI {
  col?: number | 'auto';
  mb?: number;
  mt?: number;
  mx?: number;
  my?: number;
  className?: string;
}

export interface BaseFieldExtra {
  required?: boolean;
  helperText?: string;
  disabled?: boolean;
  error?: string[];
  onInputChange?: (value: string, meta: InputActionMeta) => void;
  beforeField?: React.ReactNode;
  ui?: FieldUI;
}
