import type { CompositeField } from "../form-core/domain/field/CompositeField";
import type { FormSection } from "../form-core/domain/field/FormSection";
import type { AnyField } from "../form-core/domain/field/IField";
import type { RawFormSection } from "../form-core/domain/field/RawFormSection";
import { UnifiedFieldRegistry } from "./UnifiedFieldRegistry";

export interface RawFieldData {
  name: string;
  label: string;
  type: string;
  value: unknown;
  extra?: Record<string, unknown>;
  [key: string]: unknown;
}
const isAnyField = (obj: unknown): obj is AnyField => {
  if (obj === null || typeof obj !== "object") return false;
  
  const typedObj = obj as Record<string, unknown>;
  
  return (
    "validate" in typedObj &&
    typeof typedObj.validate === "function" &&
    "type" in typedObj &&
    typeof typedObj.type === "string"
  );
};

const isRawFieldData = (obj: unknown): obj is RawFieldData => {
  if (obj === null || typeof obj !== "object") return false;
  
  const typedObj = obj as Record<string, unknown>;
  
  return (
    "name" in typedObj &&
    typeof typedObj.name === "string" &&
    "type" in typedObj &&
    typeof typedObj.type === "string" &&
    "label" in typedObj &&
    typeof typedObj.label === "string"
  );
};

const isCompositeField = (
  field: AnyField
): field is AnyField & CompositeField => {
  return (
    "getChildren" in field &&
    typeof field.getChildren === "function" &&
    "replaceChildren" in field &&
    typeof field.replaceChildren === "function"
  );
};

export class JsonFormLoader {
  private constructor() {}

  static loadForm(
    json: RawFormSection[],
    currentValues?: Record<string, unknown>
  ): FormSection[] {
    this.validateFormSections(json);

    return json.map((section) => this.loadSection(section, currentValues));
  }

  static loadSection(
    section: RawFormSection,
    currentValues?: Record<string, unknown>
  ): FormSection {
    this.validateFormSection(section);

    return {
      title: section.title,
      description: section.description,
      fields: section.fields.map((field) =>
        this.materializeField(field, currentValues)
      ),
    };
  }

  private static materializeField(
    raw: unknown,
    currentValues?: Record<string, unknown>
  ): AnyField {
    if (isAnyField(raw)) {
      return raw;
    }

    if (!isRawFieldData(raw)) {
      throw new Error("Invalid field structure");
    }

    const field = this.createField(raw, currentValues);

    if (isCompositeField(field)) {
      const children = field
        .getChildren()
        .map((child) => this.materializeField(child, currentValues));
      field.replaceChildren(children);
    }

    return field;
  }

  private static createField(
    raw: RawFieldData,
    currentValues?: Record<string, unknown>
  ): AnyField {
    const { name, label, type, value, extra = {}, ...otherOptions } = raw;

    const options = { ...extra, ...otherOptions };

    const defaultValue = currentValues?.[name] ?? value ?? undefined;

    try {
      return UnifiedFieldRegistry.createFromJson(
        {
          key: name,
          label,
          type,
          defaultValue,
          options,
        },
        currentValues
      );
    } catch (error) {
      throw new Error(
        `Failed to create field "${name}": ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private static validateFormSections(
    sections: unknown
  ): asserts sections is RawFormSection[] {
    if (!Array.isArray(sections)) {
      throw new Error("Form must be an array of sections");
    }

    sections.forEach((section, index) => {
      if (!this.isValidSection(section)) {
        throw new Error(`Invalid section at index ${index}`);
      }
    });
  }

  private static validateFormSection(
    section: unknown
  ): asserts section is RawFormSection {
    if (!this.isValidSection(section)) {
      throw new Error("Invalid form section structure");
    }
  }

  private static isValidSection(section: unknown): section is RawFormSection {
    if (section === null || typeof section !== "object") return false;
    
    const obj = section as Record<string, unknown>;
    
    return (
      typeof obj.title === "string" &&
      Array.isArray(obj.fields)
    );
  }

  static createFormFromJson<T extends Record<string, unknown>>(
    json: string,
    currentValues?: T
  ): FormSection[] {
    try {
      const parsed = JSON.parse(json) as RawFormSection[];
      return this.loadForm(parsed, currentValues);
    } catch (error) {
      throw new Error(
        `Failed to parse form JSON: ${
          error instanceof Error ? error.message : "Invalid JSON"
        }`
      );
    }
  }

  static extractFormValues(fields: AnyField[]): Record<string, unknown> {
    return fields.reduce((acc, field) => {
      acc[field.name] = field.value;
      
      if (isCompositeField(field)) {
        const children = field.getChildren();
        
        const typedChildren = children.filter((child): child is AnyField => 
          isAnyField(child)
        );
        
        const childValues = this.extractFormValues(typedChildren);
        Object.assign(acc, childValues);
      }
      
      return acc;
    }, {} as Record<string, unknown>);
  }
}
