import type { FormSection } from '../form-core/domain/field/FormSection';
import type { RawFormSection } from '../form-core/domain/field/RawFormSection';
import { UnifiedFieldRegistry } from './UnifiedFieldRegistry';

export class JsonFormLoader {
  static loadSection(sectionJson: RawFormSection, currentValues?: Record<string, unknown>): FormSection {

    return {
      title: sectionJson.title,
      description: sectionJson.description,
      fields: sectionJson.fields.map(f => {
        const { name, label, type, value, ...extra } = f;

        const field = UnifiedFieldRegistry.createFromJson({
          key: name,
          label,
          type,
          defaultValue: value,
          options: extra
        }, currentValues);

        if (typeof field.getChildren === 'function') {
          const children = field.getChildren().map(child => {
            if ('type' in child) {
              const { name, label, type, value, extra: innerExtra, ...rest } = child;
              const childField = UnifiedFieldRegistry.createFromJson({
                key: name,
                label,
                type,
                defaultValue: value,
                options: innerExtra ?? rest as any
              }, currentValues);

              return childField;
            }
            return child;
          });

          if (typeof (field as any).setChildren === 'function') {
            (field as any).setChildren(children);
          } else if ((field as any).extra?.tabs) {
            let index = 0;
            (field as any).extra.tabs.forEach((tab: any) => {
              const len = tab.elements.length;
              tab.elements = children.slice(index, index + len);
              index += len;
            });
          }
        }

        return field;
      }),
    };
  }

  static loadForm(json: RawFormSection[], currentValues?: Record<string, unknown>): FormSection[] {
    return json.map(section => this.loadSection(section, currentValues));
  }
}
