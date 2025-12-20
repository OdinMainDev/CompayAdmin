import type { IField } from './IField';
import type { FormSection } from './FormSection';
import type { ValidationResult } from '../validation/ValidationResult';
import type { SectionFieldExtra } from '../extra/SectionFieldExtra';
import { UnifiedFieldRegistry } from '../../../form-react-adapter/UnifiedFieldRegistry';



export class SectionField
  implements IField<IField<any>[], SectionFieldExtra >
{
  type = 'section';

  constructor(
    public name: string,
    public label: string,
    public value: IField<any>[],
    public options?: SectionFieldExtra 
  ) {}

  validate(): ValidationResult {
    let isValid = true;
    const errors: string[] = [];

    this.value.forEach((field) => {
      const r = field.validate();
      if (!r.isValid) {
        isValid = false;
        errors.push(...r.errors);
      }
    });

    return { isValid, errors };
  }

  toJSON() {
    return {
      key: this.name,
      label: this.label,
      type: this.type,
      fields: this.value.map(f => f.toJSON()),
      ...this.options,
    };
  }

  static fromJson(json: any) {
    const fields = json.fields.map((f: any) =>
      UnifiedFieldRegistry.createFromJson(f)
    );

    return new SectionField(
      json.key ?? json.title,
      json.title,
      fields,
      { description: json.description, fields }
    );
  }
}