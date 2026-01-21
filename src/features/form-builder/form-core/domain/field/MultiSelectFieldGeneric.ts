import { BaseField } from './BaseField';
import type { ValidationResult } from '../validation/ValidationResult';
import type { SelectFieldExtra } from '../extra/SelectFieldExtra';

export class MultiSelectFieldGeneric<T extends string | number = string> extends BaseField<T[], SelectFieldExtra> {
  type: string;

  constructor(key: string, label: string, value: T[] = [], extra?: SelectFieldExtra, type?: string) {
    super(key, label, value, extra);
    this.type = type ?? 'multiselect';
  }

  validate(): ValidationResult {
    const isValid =
      !this.extra?.required || (Array.isArray(this.value) && this.value.length > 0);
    return {
      isValid,
      errors: isValid ? [] : ['At least one option must be selected'],
    };
  }

  static fromJson<T extends string | number = string>(json: {
    key: string;
    label: string;
    defaultValue?: T[];
    options?: SelectFieldExtra;
    type?: string;
  }) {
    const value = json.defaultValue ?? [];
    return new MultiSelectFieldGeneric<T>(json.key, json.label, value, json.options, json.type);
  }
}
