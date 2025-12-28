import type { RawFormSection } from "../field/RawFormSection";

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