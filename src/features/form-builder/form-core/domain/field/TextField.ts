import { BaseField } from './BaseField';
import type { TextFieldExtra } from '@/features/form-builder/form-core/domain/extra/TextFieldExtra';

export class TextField extends BaseField<string, TextFieldExtra> {
  type = 'text';

  static defaultExtra: TextFieldExtra = { col: 12 };

  static create(
    this: typeof TextField, 
    name: string,
    label: string,
    extra?: TextFieldExtra,
    value?: string
  ) {
    const finalExtra: TextFieldExtra = { ...this.defaultExtra, ...extra };
    return new this(name, label, value ?? '', finalExtra);
  }
  
}
