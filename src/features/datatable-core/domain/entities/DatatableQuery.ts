import type { FilterCondition } from "../value-objects/FilterCondition";

export interface ApiDatatableQuery {
  length: number;          
  start?: number;         
  order_column?: string; 
  order_direction?: 'asc' | 'desc'; 
  type_filters: FilterCondition[]
}
