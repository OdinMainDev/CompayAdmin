import type { BaseFieldExtra } from '@/features/form-builder/form-core/domain/extra/BaseFieldExtra';
import type { ValidationResult } from '@/features/form-builder/form-core/domain/validation/ValidationResult';

export interface IField<T, E extends BaseFieldExtra = BaseFieldExtra> {
  name: string;
  label: string;
  value: T;
  type: string;
  validate(): ValidationResult;
  extra?: E;
}
