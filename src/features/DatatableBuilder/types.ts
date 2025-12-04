export interface IResponse {
  success: boolean;
}

export interface IResponseError {
  success: false;
  error?: string;
  errors?: Record<string, string>;
}

export interface IResponseList<T> extends IResponse {
  success: true;
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

export interface TableColumn<T = any> {
  label: string;
  value: string;
  sortable?: boolean;
  align?: 'start' | 'center' | 'end';
  render?: (item: T) => ReactNode;
}
import { ReactNode } from 'react';
