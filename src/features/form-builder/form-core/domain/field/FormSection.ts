import type { AnyField } from './IField';

export interface FormSection {
  title: string;
  description?: string;
  fields: AnyField[];
}

