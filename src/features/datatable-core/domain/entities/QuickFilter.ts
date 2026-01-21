import type { FilterCondition } from "@/features/datatable-core/domain/value-objects/FilterCondition";

export interface QuickFilter {
  id: string;
  label: string;
  filters: FilterCondition[];
  active?: boolean;
  icon?: React.ReactNode;
  badge?: number | string;
}