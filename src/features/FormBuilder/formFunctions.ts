import { FormField, FormSection, Option } from './entities';

export const toOption = (value: string | number, label?: string): Option => ({
  value,
  label: label ?? String(value),
});

export const updateFormData = (
  setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>,
  name: string,
  value: any,
) => {
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

export const buildDefaultValues = (sections: FormSection[]) => {
  const defaults: Record<string, any> = {};
  sections.forEach((section) =>
    section.fields.forEach((field: FormField) => {
      if (field.defaultValue !== undefined) {
        defaults[field.name] = field.defaultValue;
      }
    }),
  );
  return defaults;
};
