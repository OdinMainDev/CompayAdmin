import type { FilterCondition } from "../value-objects/FilterCondition";

export interface QuickFilter {
  id: string;
  label: string;
  filters: FilterCondition[];
  active?: boolean;
  icon?: React.ReactNode;
  badge?: number | string;
}