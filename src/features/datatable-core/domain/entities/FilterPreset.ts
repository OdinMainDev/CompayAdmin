import type { FilterCondition } from "../value-objects/FilterCondition";

export interface FilterPreset {
  id: string;
  label: string;
  description?: string;
  filters: FilterCondition[];
  icon?: React.ReactNode;
  color?: string;
  default?: boolean;
  editable?: boolean;
  deletable?: boolean;
  shared?: boolean;
  createdBy?: string;
  createdAt?: Date;
}