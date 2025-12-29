export type FilterOperator = 
  | 'equals' | 'notEquals'
  | 'contains' | 'notContains'
  | 'startsWith' | 'endsWith'
  | 'greaterThan' | 'greaterThanOrEqual'
  | 'lessThan' | 'lessThanOrEqual'
  | 'between' | 'notBetween'
  | 'in' | 'notIn'
  | 'isNull' | 'isNotNull'
  | 'isEmpty' | 'isNotEmpty';

export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: unknown;
  value2?: unknown;
  logic?: 'and' | 'or';
}