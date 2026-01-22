import { BaseField } from './BaseField';
import type { ValidationResult } from '@/features/form-builder/form-core/domain/validation/ValidationResult';
import type { TextFieldExtra } from '@/features/form-builder/form-core/domain/extra/TextFieldExtra';

export class TextField extends BaseField<string, TextFieldExtra> {
  type = 'text';

  validate(): ValidationResult {
    const isValid =
      (this.value !== null && this.value !== undefined) || !this.extra?.required;
  
    return { isValid, errors: isValid ? [] : ['Field cannot be empty'] };
  }
  

  static fromJson(json: { key: string; label: string; defaultValue?: string; options?: TextFieldExtra }) {
    return new TextField(json.key, json.label, json.defaultValue ?? '', json.options);
  }
}
