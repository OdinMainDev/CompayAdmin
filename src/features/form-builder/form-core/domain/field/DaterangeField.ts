import { BaseField } from './BaseField';
import type { ValidationResult } from '@/features/form-builder/form-core/domain/validation/ValidationResult';
import type { DaterangeFieldExtra } from '@/features/form-builder/form-core/domain/extra/DaterangeFieldExtra';

export interface DaterangeValue {
  from?: number | null; 
  to?: number | null;  
}

export class DaterangeField extends BaseField<DaterangeValue , DaterangeFieldExtra> {
  type = 'date-range';

  validate(): ValidationResult {
    const isValid =
      (this.value !== null && this.value !== undefined) || !this.extra?.required;
  
    return { isValid, errors: isValid ? [] : ['Field cannot be empty'] };
  }
  
  static fromJson(json: { key: string; label: string; defaultValue?: DaterangeValue ; options?: DaterangeFieldExtra }) {
    return new DaterangeField(json.key, json.label, json.defaultValue ?? {from: null, to: null}, json.options);
  }
}
