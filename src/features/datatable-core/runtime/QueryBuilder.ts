import type { DatatableConfig } from "../domain/entities/DatatableConfig";
import type { ApiDatatableQuery } from "../domain/entities/DatatableQuery";
import type { DatatableState } from "../domain/entities/DatatableState";
import type { SortState } from "../domain/value-objects/SortDirection";
import type { FilterCondition } from "../domain/value-objects/FilterCondition";

export class QueryBuilder<T> {
  constructor(private config: DatatableConfig<T>) {}

  build(state: DatatableState<T>): ApiDatatableQuery {
    const { pagination, sort, filters } = state;
    
    const apiQuery: ApiDatatableQuery = {
      length: pagination.pageSize,
      start: (pagination.page - 1) * pagination.pageSize,
      type_filters: filters
    };

    if (sort.length > 0 && this.config.sorting?.enabled) {
      const sortItem = sort[0];
      apiQuery.order_column = sortItem.column;
      apiQuery.order_direction = sortItem.direction;
    } else if (this.config.sorting?.defaultSort) {
      apiQuery.order_column = this.config.sorting.defaultSort.column;
      apiQuery.order_direction = this.config.sorting.defaultSort.direction;
    }

    if (filters.length > 0) {
      this.applyFilters(apiQuery, filters);
    }

    return apiQuery;
  }

  applySort(column: string, direction: SortState['direction']): SortState[] {
    if (!this.config.sorting?.enabled) {
      return [];
    }

    const columnConfig = this.config.columns.find(col => col.id === column);
    if (!columnConfig?.sortable) {
      return [];
    }

    if (this.config.sorting.multiColumn) {
      return this.updateMultiSort(column, direction);
    } else {
      return [{ column, direction }];
    }
  }

  withFilters(state: DatatableState<T>, filters: FilterCondition[]): ApiDatatableQuery {
    const apiQuery = this.build(state);
    this.applyFilters(apiQuery, filters);
    return apiQuery;
  }

  withPage(state: DatatableState<T>, page: number): ApiDatatableQuery {
    const apiQuery = this.build(state);
    apiQuery.start = (page - 1) * apiQuery.length;
    return apiQuery;
  }

  withPageSize(state: DatatableState<T>, pageSize: number): ApiDatatableQuery {
    const apiQuery = this.build(state);
    apiQuery.length = pageSize;
    apiQuery.start = 0;
    return apiQuery;
  }

  private applyFilters(apiQuery: ApiDatatableQuery, filters: FilterCondition[]): void {
    apiQuery.type_filters = [...apiQuery.type_filters, ...filters];
  }

  private updateMultiSort(column: string, direction: SortState['direction']): SortState[] {
    return [{ column, direction }];
  }
}