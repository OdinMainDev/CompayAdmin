import type { AnyField } from "../../../form-platform/packages/form-core/domain/field/IField";
import type { RawFormSection } from "../../../form-platform/packages/form-core/domain/field/RawFormSection";
import type { DatatableColumn } from "../entities/DatatableColumn";


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
  createFilterForm(columns: DatatableColumn<T>[]): FormSchema; 
  createActionForm(actionId: string): FormSchema; 
  createQuickFilterForm(): FormSchema;
  mapColumnToField(column: DatatableColumn<T>): FormField;
  validateFilterForm(data: Record<string, unknown>): Promise<boolean>;
  getFormInstance(schema: FormSchema): FormInstance;
}