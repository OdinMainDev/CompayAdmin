import { BaseField } from './BaseField';
import type { ValidationResult } from '@/features/form-builder/form-core/domain/validation/ValidationResult';
import type { NumberFieldExtra } from '@/features/form-builder/form-core/domain/extra/NumberFieldExtra';


export class MerchantField extends BaseField<number | null, NumberFieldExtra> {
  type = 'merchant_id';

  validate(): ValidationResult {
    let isValid = true;
    const errors: string[] = [];

    if (this.extra?.required && (this.value === null || this.value === undefined || this.value === 0)) {
      isValid = false;
      errors.push('Field is required');
    }
    return { isValid, errors };
  }

  static fromJson(json: { key: string; label: string; defaultValue?: number | null; options?: NumberFieldExtra }) {
    debugger;
    return new MerchantField(json.key, json.label, json.defaultValue ?? null, json.options);
  }
}
