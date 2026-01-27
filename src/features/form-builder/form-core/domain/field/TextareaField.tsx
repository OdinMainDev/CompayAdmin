import { TextField } from './TextField';
import type { TextFieldExtra } from '@/features/form-builder/form-core/domain/extra/TextFieldExtra';

export class TextareaField extends TextField {
  type = 'textarea';

  static fromJson(json: {
    key: string;
    label: string;
    defaultValue?: string;
    options?: TextFieldExtra;
  }) {
    return new TextareaField(json.key, json.label, json.defaultValue ?? '', json.options);
  }
}
