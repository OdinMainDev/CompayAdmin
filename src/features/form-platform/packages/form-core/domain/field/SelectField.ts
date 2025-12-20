import { BaseField } from './BaseField';
import type { ValidationResult } from '../validation/ValidationResult';
import type { SelectFieldExtra } from '../extra/SelectFieldExtra';

export class SelectField extends BaseField<string, SelectFieldExtra> {
  type = 'select';

  validate(): ValidationResult {
    const isValid =
      !this.extra?.required || (this.value !== null && this.value !== undefined && this.value !== '');
    return {
      isValid,
      errors: isValid ? [] : ['Field is required'],
    };
  }

  static fromJson(json: {
    key: string;
    label: string;
    defaultValue?: string;
    options?: SelectFieldExtra;
  }) {
    return new SelectField(
      json.key,
      json.label,
      json.defaultValue ?? '',
      json.options
    );
  }
}
