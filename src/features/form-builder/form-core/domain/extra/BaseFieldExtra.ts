export interface BaseFieldExtra {
    required?: boolean;
    col?: number;
    helperText?: string;
    disabled?: boolean
    error?: string[]
    onInputChange?: (value: string) => void;
}