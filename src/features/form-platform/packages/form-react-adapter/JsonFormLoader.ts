import type { FormSection } from '../form-core/domain/field/FormSection';
import type { IField } from '../form-core/domain/field/IField';
import type { RawFormSection } from '../form-core/domain/field/RawFormSection';
import { UnifiedFieldRegistry } from './UnifiedFieldRegistry';


export class JsonFormLoader {
  static loadSection(sectionJson: RawFormSection, currentValues?: Record<string, unknown>): FormSection {
    return {
      title: sectionJson.title,
      description: sectionJson.description,
      fields: sectionJson.fields.map(f => {
        const { name, label, type, value, ...extra } = f;
        return UnifiedFieldRegistry.createFromJson({
          key: name,
          label,
          type,
          defaultValue: value,
          extra: extra
        }, currentValues);
      }),
    };
  }
  
  static loadForm(json: RawFormSection[], currentValues?: Record<string, unknown>): FormSection[] {
    return json.map(section => this.loadSection(section, currentValues));
  }
  
}
