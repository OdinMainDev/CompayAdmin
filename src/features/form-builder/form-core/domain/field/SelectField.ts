import { BaseField } from './BaseField';
import type { SelectFieldExtra } from '@/features/form-builder/form-core/domain/extra/SelectFieldExtra';

export class SelectField extends BaseField<string, SelectFieldExtra> {
  type = 'select';

  static create(
    this: typeof SelectField, 
    name: string,
    label: string,
    extra?: SelectFieldExtra,
    value?: string
  ) {
    return new this(name, label, value ?? '', extra);
  }
}
