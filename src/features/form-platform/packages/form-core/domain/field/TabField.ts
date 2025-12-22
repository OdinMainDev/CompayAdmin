import type { TabsFieldExtra } from "../extra/TabFieldExtra";
import type { ValidationResult } from "../validation/ValidationResult";
import { BaseField } from "./BaseField";
import type { AnyField } from "./IField";


export type TabFieldValue = Record<string, any>;

export class TabField extends BaseField<TabFieldValue, TabsFieldExtra> {
  type = 'tabs';

  validate(): ValidationResult {
    return {
      isValid: true,
      errors: []
    };
  }

  getChildren(): AnyField[] {
    if (!this.extra?.tabs) return [];

    return this.extra.tabs.flatMap(tab => tab.elements ?? []);
  }

  static fromJson(json: { key: string; label: string; defaultValue?: TabFieldValue; options?: any }) {
    return new TabField (json.key, json.label, {}, json.options);
  }
}
