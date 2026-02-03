import { FormSection } from '../field/FormSection';

export const buildDefaultValues = (sections: FormSection[]) => {
  const defaults: Record<string, unknown> = {};
  sections.forEach((section) =>
    section.fields.forEach((field) => {
      if (!('defaultValue' in field)) return;
      const defaultValue = (field as { defaultValue?: unknown }).defaultValue;
      if (defaultValue !== undefined) {
        defaults[field.name] = defaultValue;
      }
    }),
  );
  return defaults;
};
