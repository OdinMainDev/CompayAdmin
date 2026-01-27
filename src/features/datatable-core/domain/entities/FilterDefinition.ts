export interface FilterDefinition {
  id: string;
  field: string;
  label: string;
  type: FilterType;
  options?: FilterOption[];
  defaultValue?: unknown;
  validation?: FilterValidation;
  dependsOn?: string;
  group?: string;
  order?: number;
}

export type FilterType =
  | 'text'
  | 'number'
  | 'date'
  | 'datetime'
  | 'boolean'
  | 'select'
  | 'multiselect'
  | 'range'
  | 'daterange';

export interface FilterOption {
  label: string;
  value: unknown;
  disabled?: boolean;
}

export interface FilterValidation {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  minDate?: Date;
  maxDate?: Date;
}

export interface FilterGroup {
  id: string;
  label: string;
  filters: FilterDefinition[];
  collapsed?: boolean;
}
