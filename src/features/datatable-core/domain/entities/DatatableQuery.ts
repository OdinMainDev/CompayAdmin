import type { FilterCondition } from '@/features/datatable-core/domain/value-objects/FilterCondition';

export interface ApiDatatableQuery {
  length: number;
  start?: number;
  order_column?: string;
  order_direction?: 'asc' | 'desc';
  filters?: FilterCondition[];
}
