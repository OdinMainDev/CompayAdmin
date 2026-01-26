import { AnyField } from "@/features/form-builder/form-react-adapter/fields";

export interface FormSection {
  title: string;
  description?: string;
  fields: AnyField[];
}

