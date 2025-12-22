import type { CompositeField } from '../form-core/domain/field/CompositeField';
import type { FormSection } from '../form-core/domain/field/FormSection';
import type { AnyField } from '../form-core/domain/field/IField';
import type { RawFormSection } from '../form-core/domain/field/RawFormSection';
import { UnifiedFieldRegistry } from './UnifiedFieldRegistry';

export class JsonFormLoader {

  static loadForm(
    json: RawFormSection[],
    currentValues?: Record<string, unknown>
  ): FormSection[] {
    return json.map(section =>
      this.loadSection(section, currentValues)
    );
  }

  static loadSection(
    section: RawFormSection,
    currentValues?: Record<string, unknown>
  ): FormSection {
    return {
      title: section.title,
      description: section.description,
      fields: section.fields.map(field =>
        this.materializeField(field, currentValues)
      ),
    };
  }

  private static materializeField(
    raw: Record<string, any>,
    currentValues?: Record<string, unknown>
  ): AnyField {
    
    if (raw && typeof raw === 'object' && 'type' in raw && 'extra' in raw && 'validate' in raw) {
      return raw as AnyField;
    }
    const field = this.createField(raw, currentValues);

    if (this.isComposite(field)) {
      const rawChildren = field.getChildren();
      const children = rawChildren.map(child =>
        this.materializeField(child as any, currentValues)
      );

      field.replaceChildren(children);
    }

    return field;
  }

  private static createField(
    raw: Record<string, any>,
    currentValues?: Record<string, unknown>
  ): AnyField {
    const { name, label, type, value, ...options } = raw;

    return UnifiedFieldRegistry.createFromJson(
      {
        key: name,
        label,
        type,
        defaultValue: value,
        options
      },
      currentValues
    );
  }

  private static isComposite(field: AnyField): field is AnyField & CompositeField {
    return (
      typeof (field as any).getChildren === 'function' &&
      typeof (field as any).replaceChildren === 'function'
    );
  }
}
