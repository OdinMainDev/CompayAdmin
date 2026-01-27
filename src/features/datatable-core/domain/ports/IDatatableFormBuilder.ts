import { FormSection } from '@/features/form-builder/form-core/domain/field/FormSection';
import { AnyField } from '@/features/form-builder/form-react-adapter/fields';

export type FormSchema = FormSection[];
export type FormField = AnyField;
export type FormInstance = {
  validate: () => Promise<boolean>;
  submit: () => Promise<{ valid: boolean; data: Record<string, unknown> }>;
  getValues: () => Record<string, unknown>;
  setValue: (fieldName: string, value: unknown) => void;
  reset: () => void;
  fields?: AnyField[];
};

export interface IDatatableFormBuilder {
  getFormInstance(schema: FormSchema): FormInstance;
}
