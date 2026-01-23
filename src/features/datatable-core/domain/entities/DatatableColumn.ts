import type { FormField } from "@/features/datatable-core/domain/ports/IDatatableFormBuilder";

export interface DatatableColumn<T> {
  id: string;
  field: keyof T | string;
  label: string;
  visible?: boolean;
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  align?: 'left' | 'center' | 'right';
  className?: string;
  headerClassName?: string;
  sortable: boolean;
  filterable?: boolean;
  groupable?: boolean;
  resizable?: boolean;
  draggable?: boolean;
  sticky?: 'left' | 'right' | boolean;
  render?: (row: T, value: unknown, index: number) => React.ReactNode;
  headerRender?: (column: DatatableColumn<T>) => React.ReactNode;
  formatter?: (value: unknown, row: T) => unknown;
  exportFormatter?: (value: unknown, row: T) => string | number;
  filter?: {
    type: 'text' | 'select' | 'date' | 'number' | 'range' | 'custom';
    field?: FormField;
    options?: Array<{ label: string; value: unknown }>;
  };
  meta?: Record<string, unknown>;
  order?: number;
  group?: string;
}