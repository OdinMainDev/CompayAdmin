
export type RawField = Record<string, unknown>;

export interface RawFormSection {
  title: string;
  description?: string;
  fields: RawField[]; 
}

