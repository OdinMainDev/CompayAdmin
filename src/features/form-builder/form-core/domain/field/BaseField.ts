import type { ValidationResult } from '@/features/form-builder/form-core/domain/validation/ValidationResult';
import type { BaseFieldExtra, FieldUI } from '@/features/form-builder/form-core/domain/extra/BaseFieldExtra';

export abstract class BaseField<
  T,
  E extends BaseFieldExtra = BaseFieldExtra
> {
  abstract type: string;
  public extra?: E

  protected static defaultUi: FieldUI = {
    mb: 2,
  };

  constructor(
    public name: string,
    public label: string,
    public value: T,
    extra?: E 
  ) {

    const ui = {
      ...BaseField.defaultUi,
      ...extra?.ui,
    };

    this.extra = {
      ...extra,
      ui,
    } as E;
  }

  validate(): ValidationResult {
    const isValid =
      (this.value !== null && this.value !== undefined) || !this.extra?.required;
  
    return { isValid, errors: isValid ? [] : ['Field cannot be empty'] };
  }
  
}
