import { BaseField } from './BaseField';
import type { NumberFieldExtra } from '@/features/form-builder/form-core/domain/extra/NumberFieldExtra';

export class NumberField extends BaseField<number | null, NumberFieldExtra> {
  type = 'number';

  static defaultExtra: NumberFieldExtra = { ui: { col: 12 } };

  static create(
    this: typeof NumberField,
    name: string,
    label: string,
    extra?: NumberFieldExtra,
    value?: number,
  ) {
    const finalExtra: NumberFieldExtra = { ...this.defaultExtra, ...extra };
    return new this(name, label, value ?? null, finalExtra);
  }
}
