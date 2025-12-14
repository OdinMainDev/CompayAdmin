export type FormFieldType =
  | 'text'
  | 'number'
  | 'password'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'image';

export interface Option {
  label: string;
  value: string | number;
}

export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  options?: Option[];
  helperText?: string;
  col?: number;
  defaultValue?: string | number | string[];
}

export interface FormSection {
  title?: string;
  description?: string;
  fields: FormField[];
}
