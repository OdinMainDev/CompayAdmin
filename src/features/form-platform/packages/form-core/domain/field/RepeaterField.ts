import type { BaseFieldExtra } from '../extra/BaseFieldExtra';
import { BaseField } from './BaseField';
import type { AnyField } from './IField';

export type RepeaterFieldValue = Record<string, any>;

export interface RepeaterFieldExtra extends BaseFieldExtra{
  elements: AnyField[];
  minItems?: number; 
  maxItems?: number; 
}

export class RepeaterField extends BaseField<RepeaterFieldValue, RepeaterFieldExtra> {
  type = 'repeater';

  getChildren(): AnyField[] {
    if (!this.extra?.elements) return [];

    return this.extra.elements;
  }

  validate() {
    const errors: string[] = [];
    const min = this.extra?.minItems ?? 0;
    const max = this.extra?.maxItems ?? Infinity;

    if (this.value?.length < min) errors.push(`Min ${min} elements`);
    if (this.value?.length > max) errors.push(`Max ${max} elements`);

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static fromJson(json: { key: string; label: string; defaultValue?: RepeaterFieldValue; options?: any }) {
    return new RepeaterField (json.key, json.label, {}, json.options);
  }
}
