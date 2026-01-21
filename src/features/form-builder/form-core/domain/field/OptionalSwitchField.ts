import { BaseField } from './BaseField';
import type { ValidationResult } from '@/features/form-builder/form-core/domain/validation/ValidationResult';
import type { BaseFieldExtra } from '@/features/form-builder/form-core/domain/extra/BaseFieldExtra';

export class OptionalSwitchField extends BaseField<boolean | null, BaseFieldExtra> {
  type = 'optional-switch';

  validate(): ValidationResult {
    const isValid = true;
    return {
      isValid,
      errors: []
    };
  }

  static fromJson(json: { key: string; label: string; defaultValue?: boolean | null; options?: BaseFieldExtra }) {
    return new OptionalSwitchField(json.key, json.label, json.defaultValue ?? null, json.options);
  }
}

