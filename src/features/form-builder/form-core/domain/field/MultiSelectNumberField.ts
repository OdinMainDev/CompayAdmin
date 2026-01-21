import { MultiSelectFieldGeneric } from './MultiSelectFieldGeneric';
import type { SelectFieldExtra } from '../extra/SelectFieldExtra';

export class MultiSelectNumberField extends MultiSelectFieldGeneric<number> {
  type = 'multiselect-number';

  constructor(key: string, label: string, value: (string | number)[] = [], extra?: SelectFieldExtra) {
    const numericValue = value.map(v => Number(v));
    super(key, label, numericValue, extra, 'multiselect-number');
  }
}
