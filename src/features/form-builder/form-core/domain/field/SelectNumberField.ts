import type { SelectFieldExtra } from "../extra/SelectFieldExtra";
import { SelectFieldGeneric } from "./SelectFieldGeneric";

export class SelectNumberField extends SelectFieldGeneric<number> {
    type = 'select-number';
  
    constructor(key: string, label: string, value: string | number, extra?: SelectFieldExtra) {
      super(key, label, Number(value), extra, 'select-number');
    }
  }
  