import { BaseField } from './BaseField';
import type { ValidationResult } from '../validation/ValidationResult';

export class SwitchField extends BaseField<boolean, { required?: boolean }> {
  type = 'switch';

  validate(): ValidationResult {
    const isValid = !this.extra?.required || this.value === true;
    return {
      isValid,
      errors: isValid ? [] : ['Field must be enabled'],
    };
  }

  static fromJson(json: { key: string; label: string; defaultValue?: boolean; options?: any }) {
    return new SwitchField(json.key, json.label, json.defaultValue ?? false, json.options);
  }
}
