import type { RawFormSection } from '../form-platform/packages/form-core/domain/field/RawFormSection';
import { FormField, FormSection, Option } from './entities';

export const toOption = (value: string | number, label?: string): Option => ({
  value,
  label: label ?? String(value),
});

export const updateFormData = (
  setFormData: React.Dispatch<React.SetStateAction<Record<string, unknown>>>,
  name: string,
  value: unknown,
) => {
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

export const buildDefaultValues = (sections: RawFormSection[]) => {
  const defaults: Record<string, unknown> = {};
  sections.forEach((section) =>
    section.fields.forEach((field: Record<string, any>) => {
      if (field.defaultValue !== undefined) {
        defaults[field.name] = field.defaultValue;
      }
    }),
  );
  return defaults;
};
