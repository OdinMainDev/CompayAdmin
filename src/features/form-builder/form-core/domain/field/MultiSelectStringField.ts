import { MultiSelectFieldGeneric } from './MultiSelectFieldGeneric';
import type { SelectFieldExtra } from '../extra/SelectFieldExtra';

export class MultiSelectStringField extends MultiSelectFieldGeneric<string> {
  type = 'multiselect';

  constructor(key: string, label: string, value: string[] = [], extra?: SelectFieldExtra) {
    super(key, label, value, extra, 'multiselect');
  }
}
