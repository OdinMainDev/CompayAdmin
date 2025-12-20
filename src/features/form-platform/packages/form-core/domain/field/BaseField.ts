import type { IField } from './IField';
import type { ValidationResult } from '../validation/ValidationResult';

export abstract class BaseField<
  T,
  ExtraProps extends Record<string, any> = {}
> implements IField<T, ExtraProps> {
  abstract type: string;
  public extra?: ExtraProps;

  constructor(
    public name: string,
    public label: string,
    public value: T,
    extra?: ExtraProps
  ) {
    this.extra = extra;
  }

  abstract validate(): ValidationResult;

  toJSON() {
    return { name: this.name, label: this.label, type: this.type, value: this.value, ...this.extra };
  }
}
