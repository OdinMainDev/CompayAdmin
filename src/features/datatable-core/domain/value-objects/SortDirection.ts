export type SortDirection = 'asc' | 'desc';
export type SortNulls = 'first' | 'last';

export interface SortState {
  column: string;
  direction: SortDirection;
  nulls?: SortNulls;
}
