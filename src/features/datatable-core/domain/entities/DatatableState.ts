import { FilterReponse } from "@/features/api-client/types/datatable";
import type { FilterCondition } from "@/features/datatable-core/domain/value-objects/FilterCondition";
import type { SortState } from "@/features/datatable-core/domain/value-objects/SortDirection";

export interface DatatableState<T> {
  data: T[];
  remoteFilters: FilterReponse[];
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
    pageSizeOptions: number[];
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