import type { AnyField } from "@/features/form-builder/form-core/domain/field/IField";
import type { RawFormSection } from "@/features/form-builder/form-core/domain/field/RawFormSection";
import type { DatatableColumn } from "@/features/datatable-core/domain/entities/DatatableColumn";


export type FormSchema = RawFormSection[];
export type FormField = AnyField;
export type FormInstance = {
  validate: () => Promise<boolean>;
  submit: () => Promise<{ valid: boolean; data: Record<string, unknown> }>;
  getValues: () => Record<string, unknown>;
  setValue: (fieldName: string, value: unknown) => void;
  reset: () => void;
  fields?: AnyField[];
};

export interface IDatatableFormBuilder<T> {
  createActionForm(actionId: string): FormSchema; 
  createQuickFilterForm(): FormSchema;
  getFormInstance(schema: FormSchema): FormInstance;
}