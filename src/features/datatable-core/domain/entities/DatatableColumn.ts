import type { FormField } from '@/features/datatable-core/domain/ports/IDatatableFormBuilder';

export interface DatatableColumn<T> {
  id: string;
  field: keyof T | string;
  label: string;
  visible?: boolean;
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  align?: 'left' | 'center' | 'right';
  headerClassName?: string;
  sortable: boolean;
  filterable?: boolean;
  resizable?: boolean;
  sticky?: 'left' | 'right' | boolean;
  render?: (row: T, value: unknown, index: number) => React.ReactNode;
  headerRender?: (column: DatatableColumn<T>) => React.ReactNode;
  formatter?: (value: unknown, row: T) => unknown;
  filter?: {
    type: 'text' | 'select' | 'date' | 'number' | 'range' | 'custom';
    field?: FormField;
    options?: Array<{ label: string; value: unknown }>;
  };
}
