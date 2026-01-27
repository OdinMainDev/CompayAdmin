import { BaseField } from './BaseField';
import type { BaseFieldExtra } from '@/features/form-builder/form-core/domain/extra/BaseFieldExtra';

export class SwitchField extends BaseField<boolean, BaseFieldExtra> {
  type = 'switch';

  static create(
    this: typeof SwitchField,
    name: string,
    label: string,
    extra?: BaseFieldExtra,
    value?: boolean,
  ) {
    return new this(name, label, value ?? false, extra);
  }
}
