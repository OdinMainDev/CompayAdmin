import { BaseField } from './BaseField';
import type { ValidationResult } from '../validation/ValidationResult';
import type { NumberFieldExtra } from '../extra/NumberFieldExtra';


export class NumberField extends BaseField<number, NumberFieldExtra> {
  type = 'number';

  validate(): ValidationResult {
    let isValid = true;
    const errors: string[] = [];

    if (this.extra?.required && (this.value === null || this.value === undefined || this.value === 0)) {
      isValid = false;
      errors.push('Field is required');
    }
    return { isValid, errors };
  }

  static fromJson(json: { key: string; label: string; defaultValue?: number; extra?: NumberFieldExtra }) {
    return new NumberField(json.key, json.label, json.defaultValue ?? 0, json.extra);
  }
}
