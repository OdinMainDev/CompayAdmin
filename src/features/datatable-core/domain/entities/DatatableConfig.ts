import type { FilterCondition } from '@/features/datatable-core/domain/value-objects/FilterCondition';
import type {
  SortDirection,
  SortState,
} from '@/features/datatable-core/domain/value-objects/SortDirection';
import type { BulkAction } from './BulkAction';
import type { DatatableColumn } from './DatatableColumn';
import type { ApiDatatableQuery } from './DatatableQuery';
import type { IResponseList } from './DatatableResponse';
import type { FilterPreset } from './FilterPreset';
import type { QuickAction } from './QuickAction';
import type { RowAction } from './RowAction';
import { ApiError } from '@/features/api-client/types/core';
import { IFilterResponse } from './IFilterResponse';
import { IRequestOptions } from './DatatableRequest';

export interface DatatableConfig<T> {
  title?: string;
  subtitle?: string;
  dataSource: (query: IRequestOptions) => Promise<IResponseList<T> | ApiError>;
  filtersSource?: () => Promise<IFilterResponse | ApiError>;

  columns: DatatableColumn<T>[];
  quickActions?: QuickAction[];
  rowActions?: RowAction<T>[];

  pagination?: {
    enabled: boolean;
    pageSize: number;
    pageSizeOptions: number[];
  };
  sorting?: {
    enabled?: boolean;
    multiColumn?: boolean;
    defaultSort?: { column: string; direction: SortDirection };
  };
  filtering?: {
    enabled: boolean;
    mode: 'inline' | 'modal' | 'sidebar';
    presets?: FilterPreset[];
  };
  selection?: {
    enabled: boolean;
    mode: 'single' | 'multiple' | 'checkbox';
    actions?: BulkAction[];
  };
  export?: {
    disabled: boolean;
    formats?: ('csv' | 'excel' | 'pdf')[];
    fileName?: string;
    columns?: string[];
    handler?(query: ApiDatatableQuery, format: 'csv' | 'excel'): Promise<unknown>;
  };
  ui?: {
    density: 'compact' | 'normal' | 'comfortable';
    striped: boolean;
    bordered: boolean;
    hoverable: boolean;
    stickyHeader: boolean;
    resizableColumns: boolean;
    columnVisibility: boolean;
  };
  state?: {
    persistent: boolean;
    storageKey?: string;
    saveFilters: boolean;
    saveSorting: boolean;
    saveColumnState: boolean;
  };
  events?: {
    onRowClick?: (row: T, event: React.MouseEvent) => void;
    onRowDoubleClick?: (row: T, event: React.MouseEvent) => void;
    onSelectionChange?: (selected: T[]) => void;
    onSortChange?: (sort: SortState) => void;
    onFilterChange?: (filters: FilterCondition[]) => void;
  };
  formIntegration?: {
    formBuilder: unknown;
    fieldMappings: FieldMapping[];
    validationSchema?: unknown;
  };
}

interface FieldMapping {
  datatableField: string;
  formField: string;
  transform?: (value: unknown) => unknown;
}
