import { BaseField } from '@/features/form-builder/form-core/domain/field/BaseField';
import type { NumberFieldExtra } from '@/features/form-builder/form-core/domain/extra/NumberFieldExtra';

export class MerchantField extends BaseField<number | null, NumberFieldExtra> {
  type = 'merchant_id';

  static create(
    this: typeof MerchantField,
    name: string,
    label: string,
    extra?: NumberFieldExtra,
    value?: number | null,
  ) {
    return new this(name, label, value ?? null, extra);
  }
}
