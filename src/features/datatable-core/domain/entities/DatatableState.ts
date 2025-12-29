import type { FilterCondition } from "../value-objects/FilterCondition";
import type { SortState } from "../value-objects/SortDirection";

export interface DatatableState<T> {
  data: T[];
  total: number;
  filtered: number;
  loading: boolean;
  error: Error | null;
  selection: Set<string>;
  sort: SortState[];
  filters: FilterCondition[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
  };
  columnState: {
    order: string[];
    visibility: Record<string, boolean>;
    widths: Record<string, number>;
  };
  formState: {
    filterForm: Record<string, unknown>;
    actionForms: Record<string, Record<string, unknown>>;
  };
}