import type { BaseFieldExtra } from '@/features/form-builder/form-core/domain/extra/BaseFieldExtra';
import { BaseField } from './BaseField';
import type { CompositeField } from './CompositeField';
import { AnyField } from '@/features/form-builder/form-react-adapter/fields';

export type RepeaterFieldValue = Record<string, unknown>[];

export interface RepeaterFieldExtra extends BaseFieldExtra {
  elements: AnyField[];
  minItems?: number;
  maxItems?: number;
  elementTitle?: string
}

export class RepeaterField
  extends BaseField<RepeaterFieldValue, RepeaterFieldExtra>
  implements CompositeField
{
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
    const extraWithDefaults: RepeaterFieldExtra = {
      ...extra,
      elements: extra?.elements ?? [],
      minItems: extra?.minItems ?? 0,
    };
    return new this(name, label, [], extraWithDefaults);
  }
}
