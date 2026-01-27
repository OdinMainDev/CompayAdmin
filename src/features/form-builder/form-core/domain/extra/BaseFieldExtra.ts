import type { InputActionMeta } from 'react-select';

export interface BaseFieldExtra {
    required?: boolean;
    col?: number | 'auto';
    helperText?: string;
    disabled?: boolean
    error?: string[]
    onInputChange?: (value: string, meta: InputActionMeta) => void;
}