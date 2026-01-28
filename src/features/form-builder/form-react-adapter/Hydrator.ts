import { CompositeField } from '../form-core/domain/field/CompositeField';
import { FormSection } from '../form-core/domain/field/FormSection';
import { AnyField } from './fields';

export class FormHydrator {
  static hydrate<T>(
    sections: FormSection[],
    values?: T,
    errors?: Record<string, string[]>,
  ): FormSection[] {
    return sections.map((section) => ({
      ...section,
      fields: section.fields.map((field) => this.hydrateField(field, values, errors)),
    }));
  }

  private static hydrateField<T>(
    field: AnyField,
    values?: T,
    errors?: Record<string, string[]>,
  ): AnyField {
    if (values && typeof values === 'object' && values !== null) {
      if (field.name in values) {
        const rawValue = (values as Record<string, unknown>)[field.name];
        field.value = rawValue as typeof field.value;
      }
    }

    if (errors && typeof errors === 'object' && errors !== null) {
      if (field.name in errors) {
        field.extra = {
          ...(field.extra ?? {}),
          error: errors[field.name] ?? [],
        };
      }
    }

    if (this.isCompositeField(field)) {
      field.replaceChildren(
        field.getChildren().map((child) => this.hydrateField(child, values, errors)),
      );
    }

    return field;
  }

  private static isCompositeField(field: AnyField): field is AnyField & CompositeField {
    return (
      'getChildren' in field &&
      typeof field.getChildren === 'function' &&
      'replaceChildren' in field &&
      typeof field.replaceChildren === 'function'
    );
  }
}
