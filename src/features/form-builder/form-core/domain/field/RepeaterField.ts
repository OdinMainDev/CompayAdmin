import type { BaseFieldExtra } from '@/features/form-builder/form-core/domain/extra/BaseFieldExtra';
import { BaseField } from './BaseField';
import type { CompositeField } from './CompositeField';
import type { AnyField } from './IField';
import type { ValidationResult } from '@/features/form-builder/form-core/domain/validation/ValidationResult';

export interface RepeaterItem {
  id: string;
  values: unknown[]; 
}

export type RepeaterFieldValue = RepeaterItem[];

export interface RepeaterFieldExtra extends BaseFieldExtra {
  elements: AnyField[];
  minItems?: number;
  maxItems?: number;
}

export class RepeaterField extends BaseField<RepeaterFieldValue, RepeaterFieldExtra> 
  implements CompositeField {
  
  readonly type = 'repeater' as const;

  constructor(
    name: string,
    label: string,
    value: RepeaterFieldValue = [],
    extra?: RepeaterFieldExtra
  ) {
    super(name, label, value, extra);
  }

  getChildren(): AnyField[] {
    return this.extra?.elements ?? [];
  }

  replaceChildren(children: AnyField[]): void {
    if (this.extra) {
      this.extra.elements = children;
    }
  }

  validate(): ValidationResult {
    const errors: string[] = [];
    const min = this.extra?.minItems ?? 0;
    const max = this.extra?.maxItems ?? Infinity;

    if (this.value.length < min) {
      errors.push(`Минимум ${min} элементов`);
    }
    
    if (this.value.length > max) {
      errors.push(`Максимум ${max} элементов`);
    }

    const elements = this.getChildren();
    this.value.forEach((item, index) => {
      if (item.values.length !== elements.length) {
        errors.push(`Элемент ${index + 1}: несоответствие количества полей`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : [],
    };
  }

  static fromJson(json: { 
    key: string; 
    label: string; 
    defaultValue?: RepeaterFieldValue; 
    options?: RepeaterFieldExtra 
  }): RepeaterField {
    return new RepeaterField(
      json.key, 
      json.label, 
      json.defaultValue ?? [], 
      json.options
    );
  }
}