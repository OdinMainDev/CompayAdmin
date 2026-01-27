import { BaseField } from './BaseField';
import type { SelectFieldExtra } from '@/features/form-builder/form-core/domain/extra/SelectFieldExtra';

export class MultiSelectField extends BaseField<string[], SelectFieldExtra> {
  type = 'multiselect';

  static create(
    this: typeof MultiSelectField,
    name: string,
    label: string,
    extra?: SelectFieldExtra,
    value?: string[],
  ) {
    return new this(name, label, value ?? [], extra);
  }
}
