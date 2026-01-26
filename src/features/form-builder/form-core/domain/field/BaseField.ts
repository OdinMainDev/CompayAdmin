import type { ValidationResult } from '@/features/form-builder/form-core/domain/validation/ValidationResult';
import type { BaseFieldExtra } from '@/features/form-builder/form-core/domain/extra/BaseFieldExtra';

export abstract class BaseField<
  T,
  E extends BaseFieldExtra = BaseFieldExtra
> {
  abstract type: string;
  public extra?: E

  constructor(
    public name: string,
    public label: string,
    public value: T,
    extra?: E 
  ) {
    this.extra = extra;
  }

  validate(): ValidationResult {
    const isValid =
      (this.value !== null && this.value !== undefined) || !this.extra?.required;
  
    return { isValid, errors: isValid ? [] : ['Field cannot be empty'] };
  }
  
}
