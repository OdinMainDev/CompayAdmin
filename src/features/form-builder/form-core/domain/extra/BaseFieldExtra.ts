import type { InputActionMeta } from 'react-select';

export interface FieldUI {
  col?: number | 'auto';
  className?: string;
}

export interface BaseFieldExtra {
  required?: boolean;
  helperText?: string;
  disabled?: boolean;
  error?: string[];
  onInputChange?: (value: string, meta: InputActionMeta) => void;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  beforeField?: React.ReactNode;
  ui?: FieldUI;
}
