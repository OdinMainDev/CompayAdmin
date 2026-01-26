import type { TabsFieldExtra } from "@/features/form-builder/form-core/domain/extra/TabFieldExtra";
import { BaseField } from "./BaseField";
import type { CompositeField } from "./CompositeField";
import { AnyField } from "@/features/form-builder/form-react-adapter/fields";

export type TabFieldValue = Record<string, unknown>;

export class TabField
  extends BaseField<TabFieldValue, TabsFieldExtra>
  implements CompositeField {

  readonly isComposite = true;

  type = 'tabs';

  getChildren(): AnyField[] {
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

  static create(
    this: typeof TabField, 
    name: string,
    label: string,
    extra?: TabsFieldExtra,
  ) {
    return new this(name, label, {}, extra );
  }
}
