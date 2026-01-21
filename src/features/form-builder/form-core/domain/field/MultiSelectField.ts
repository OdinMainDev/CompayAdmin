import { BaseField } from './BaseField';
import type { ValidationResult } from '../validation/ValidationResult';
import type { SelectFieldExtra } from '../extra/SelectFieldExtra';

export class MultiSelectField extends BaseField<string[], SelectFieldExtra> {
  type = 'multiselect';

  validate(): ValidationResult {
    const isValid =
      !this.extra?.required || (Array.isArray(this.value) && this.value.length > 0);

    return {
      isValid,
      errors: isValid ? [] : ['At least one option must be selected'],
    };
  }

  static fromJson(json: {
    key: string;
    label: string;
    defaultValue?: string[];
    options?: SelectFieldExtra;
  }) {
    return new MultiSelectField(
      json.key,
      json.label,
      json.defaultValue ?? [],
      json.options
    );
  }
}
