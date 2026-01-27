import type { BaseFieldExtra } from '@/features/form-builder/form-core/domain/extra/BaseFieldExtra';
import { BaseField } from './BaseField';
import type { CompositeField } from './CompositeField';
import { AnyField } from '@/features/form-builder/form-react-adapter/fields';


export type RepeaterFieldValue = Record<string, unknown>[];

export interface RepeaterFieldExtra extends BaseFieldExtra {
  elements: AnyField[];
  minItems?: number;
  maxItems?: number;
}

export class RepeaterField extends BaseField<RepeaterFieldValue, RepeaterFieldExtra> 
  implements CompositeField {
  readonly isComposite = true;
  readonly type = 'repeater';

  getChildren(): AnyField[] {
    return this.extra?.elements ?? [];
  }
  replaceChildren(children: AnyField[]): void {
    if (this.extra) {
      this.extra.elements = children;
    }
  }

  static create(
    this: typeof RepeaterField, 
    name: string,
    label: string,
    extra?: RepeaterFieldExtra,
  ) {
    return new this(name, label, [], extra );
  }

}