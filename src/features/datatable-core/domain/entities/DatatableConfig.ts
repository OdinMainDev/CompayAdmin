import type { RawFormSection } from "../../../form-platform/packages/form-core/domain/field/RawFormSection";
import type { FilterCondition } from "../value-objects/FilterCondition";
import type { SortDirection, SortState } from "../value-objects/SortDirection";
import type { BulkAction } from "./BulkAction";
import type { DatatableColumn } from "./DatatableColumn";
import type { DatatableQuery } from "./DatatableQuery";
import type { DatatableResponse } from "./DatatableResponse";
import type { FilterDefinition } from "./FilterDefinition";
import type { FilterPreset } from "./FilterPreset";
import type { QuickAction } from "./QuickAction";
import type { QuickFilter } from "./QuickFilter";
import type { RowAction } from "./RowAction";


export interface DatatableConfig<T = unknown> {
  title?: string;
  subtitle?: string;
  id: string;
  dataSource: string | ((query: DatatableQuery) => Promise<DatatableResponse<T>>);
  filtersSource?: string | (() => Promise<FilterDefinition[]>);
  columns: DatatableColumn<T>[];
  filterForm?: RawFormSection[];
  actionForms?: Record<string, RawFormSection[]>;
  quickActions?: QuickAction<RawFormSection[]>[];
  rowActions?: RowAction<T>[]; 

  pagination?: {
    enabled: boolean;
    pageSize: number;
    pageSizeOptions: number[];
    position: 'top' | 'bottom' | 'both';
  };
  sorting?: {
    enabled: boolean;
    multiColumn: boolean;
    defaultSort?: { column: string; direction: SortDirection };
  };
  filtering?: {
    enabled: boolean;
    mode: 'inline' | 'modal' | 'sidebar';
    presets?: FilterPreset[];
    quickFilters?: QuickFilter[];
  };
  selection?: {
    enabled: boolean;
    mode: 'single' | 'multiple' | 'checkbox';
    actions?: BulkAction[];
  };
  export?: {
    enabled: boolean;
    formats: ('csv' | 'excel' | 'pdf')[];
    columns?: string[];
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