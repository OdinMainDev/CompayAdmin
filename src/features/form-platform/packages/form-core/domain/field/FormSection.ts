import type { IField } from './IField';

export interface FormSection {
  title: string;
  description?: string;
  fields: IField<any>[];
}

