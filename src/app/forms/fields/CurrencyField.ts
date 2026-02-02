import { BaseField } from '@/features/form-builder/form-core/domain/field/BaseField';
import { TextFieldExtra } from '@/features/form-builder/form-core/domain/extra/TextFieldExtra';

export class CurrencyField extends BaseField<number | null | string, TextFieldExtra> {
  type = 'currency';

  static create(
    this: typeof CurrencyField,
    name: string,
    label: string,
    extra?: TextFieldExtra,
    value?: number | null | string,
  ) {
    return new this(name, label, value ?? null, extra);
  }
}
