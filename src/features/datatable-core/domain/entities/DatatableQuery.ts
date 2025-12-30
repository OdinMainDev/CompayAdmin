import type { FilterCondition } from "../value-objects/FilterCondition";
import type { SortState } from "../value-objects/SortDirection";

// export interface DatatableQuery {
//   pagination: {
//     page: number;
//     pageSize: number;
//   };
//   sort?: SortState[];
//   filters: FilterCondition[];
//   search?: string;
//   columns?: string[];
//   include?: string[];
//   groupBy?: string[];
//   aggregates?: Record<string, string>;
// }

export interface ApiDatatableQuery {
  length: number;          
  start?: number;         
  order_column?: string; 
  order_direction?: 'asc' | 'desc'; 
  type_filters: FilterCondition[]
}
