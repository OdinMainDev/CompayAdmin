import { UnifiedFieldRegistry } from "../../../form-react-adapter/UnifiedFieldRegistry";
import type { ValidationResult } from "../validation/ValidationResult";
import type { IField } from "./IField";

export interface TabFieldExtra {
  title: string;
  repeater_items: IField<any, any>[]; 
}

export class TabField implements IField<null, TabFieldExtra> {
    name: string;
    label: string;
    value: null = null;
    type = 'tab';
    extra: TabFieldExtra;
  
    constructor(key: string, label: string, extra: TabFieldExtra) {
      if (!extra) throw new Error('TabField requires "extra" property');
      this.name = key;
      this.label = label;
      this.extra = extra;
    }
  static fromJson(json: { key: string; label: string; defaultValue?: null; extra?: TabFieldExtra }): TabField {
    if (!json.extra) {
      throw new Error(`TabField requires 'extra' property`);
    }
  
    const items = (json.extra.repeater_items || []).map(f => {
      if ('type' in f && 'key' in f && 'label' in f) {
        const jsonField = f as {
          type: string;
          key: string;
          label: string;
          defaultValue?: unknown;
          extra?: any;
        };
        return UnifiedFieldRegistry.createFromJson(jsonField);
      }
  
      throw new Error('repeater_items must contain JSON objects with type/key/label');
    });
  
    return new TabField(json.key, json.label, { ...json.extra, repeater_items: items });
  }
  
  

  validate(): ValidationResult {
    return { isValid: true, errors: [] };
  }

  toJSON() {
    return {
      type: this.type,
      key: this.name,
      label: this.label,
      extra: {
        title: this.extra.title,
        repeater_items: this.extra.repeater_items.map(f => f.toJSON())
      }
    };
  }
}
