import type { TabsFieldExtra } from "../extra/TabFieldExtra";
import type { ValidationResult } from "../validation/ValidationResult";
import { BaseField } from "./BaseField";
import type { CompositeField } from "./CompositeField";
import type { AnyField } from "./IField";


export type TabFieldValue = Record<string, any>;

export class TabField
  extends BaseField<TabFieldValue, TabsFieldExtra>
  implements CompositeField {

  type = 'tabs';

  validate(): ValidationResult {
    return {
      isValid: true,
      errors: []
    };
  }


  getChildren(): unknown[] {
    if (!this.extra?.tabs) return [];
    return this.extra.tabs.flatMap(tab => tab.elements ?? []);
  }

  replaceChildren(children: AnyField[]): void {
    if (!this.extra?.tabs) return;

    let index = 0;
    this.extra.tabs.forEach(tab => {
      const len = tab.elements?.length ?? 0;

      tab.elements = children.slice(index, index + len);
      index += len;
    });
  }


  static fromJson(json: { key: string; label: string; defaultValue?: TabFieldValue; options?: any }) {
    return new TabField (json.key, json.label, {}, json.options);
  }
}
