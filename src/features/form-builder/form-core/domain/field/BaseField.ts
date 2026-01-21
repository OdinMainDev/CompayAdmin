import type { AnyField, IField } from './IField';
import type { ValidationResult } from '@/features/form-builder/form-core/domain/validation/ValidationResult';
import type { BaseFieldExtra } from '@/features/form-builder/form-core/domain/extra/BaseFieldExtra';

export abstract class BaseField<
  T,
  E extends BaseFieldExtra = BaseFieldExtra
> implements AnyField {
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

  abstract validate(): ValidationResult;

  toJSON(): IField<T, E> {
    return { 
      name: this.name, 
      label: this.label, 
      type: this.type, 
      value: this.value,
      validate: this.validate.bind(this),
      toJSON: this.toJSON.bind(this),
      ...this.extra 
    } as IField<T, E>;
  }
}
