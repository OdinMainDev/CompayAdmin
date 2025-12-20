import type { SelectFieldExtra } from "../extra/SelectFieldExtra";
import { SelectFieldGeneric } from "./SelectFieldGeneric";

export class SelectStringField extends SelectFieldGeneric<string> {
    type = 'select';
  
    constructor(key: string, label: string, value: string | number, extra?: SelectFieldExtra) {
        super(key, label, String(value), extra, 'select');
      }
      
  }