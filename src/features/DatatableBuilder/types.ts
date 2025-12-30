import { type ReactNode } from 'react';

export interface IResponse {
  success: boolean;
}

export interface IResponseError {
  success: false;
  error?: string;
  errors?: Record<string, string>;
}

export interface IResponseList<T> extends IResponse {
  success: boolean;
  data: {
    recordsCount: number;
    recordsFiltered: number;
    recordsTotal: number;
    data: T[];
  };
}

export interface IDatatableFilters {
  length: number;
  start: number;
  order_column: string;
  order_direction: 'asc' | 'desc';
  search?: string;
}

export interface TableColumn<T = unknown> {
  label: string;
  value: string;
  sortable?: boolean;
  align?: 'start' | 'center' | 'end';
  render?: (item: T) => ReactNode;
}
