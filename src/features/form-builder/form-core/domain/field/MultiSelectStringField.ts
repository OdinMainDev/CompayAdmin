import { MultiSelectFieldGeneric } from './MultiSelectFieldGeneric';
import type { SelectFieldExtra } from '@/features/form-builder/form-core/domain/extra/SelectFieldExtra';

export class MultiSelectStringField extends MultiSelectFieldGeneric<string> {
  type = 'multiselect';

  constructor(key: string, label: string, value: string[] = [], extra?: SelectFieldExtra) {
    super(key, label, value, extra, 'multiselect');
  }
}
