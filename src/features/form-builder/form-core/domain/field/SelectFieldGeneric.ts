import { BaseField } from './BaseField';
import type { ValidationResult } from '@/features/form-builder/form-core/domain/validation/ValidationResult';
import type { SelectFieldExtra } from '@/features/form-builder/form-core/domain/extra/SelectFieldExtra';

export class SelectFieldGeneric<T extends string | number = string> extends BaseField<
  T,
  SelectFieldExtra
> {
  type: string;

  constructor(key: string, label: string, value: T, extra?: SelectFieldExtra, type?: string) {
    super(key, label, value, extra);
    this.type = type ?? 'select';
  }

  validate(): ValidationResult {
    const isValid =
      !this.extra?.required ||
      (this.value !== null &&
        this.value !== undefined &&
        (typeof this.value === 'string' ? this.value !== '' : true));
    return {
      isValid,
      errors: isValid ? [] : ['Field is required'],
    };
  }

  static fromJson<T extends string | number = string>(json: {
    key: string;
    label: string;
    defaultValue?: T;
    options?: SelectFieldExtra;
    type?: string;
  }) {
    let value: T;
    if (typeof json.defaultValue === 'number') {
      value = (json.defaultValue ?? 0) as T;
    } else {
      value = (json.defaultValue ?? '') as T;
    }
    return new SelectFieldGeneric<T>(json.key, json.label, value, json.options, json.type);
  }
}
