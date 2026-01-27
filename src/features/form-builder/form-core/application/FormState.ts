export interface FieldState<T = unknown> {
  value: T;
  error?: string;
  touched: boolean;
}

export interface FormState {
  fields: Record<string, FieldState>;
  isValid: boolean;
  isSubmitting: boolean;
}
