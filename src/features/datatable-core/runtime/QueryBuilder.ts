import type { DatatableConfig } from "../domain/entities/DatatableConfig";
import type { DatatableQuery } from "../domain/entities/DatatableQuery";
import type { DatatableState } from "../domain/entities/DatatableState";
import type { SortState } from "../domain/value-objects/SortDirection";

export class QueryBuilder<T> {
  constructor(private config: DatatableConfig<T>) {}

  build(state: DatatableState): DatatableQuery {
    return {
      pagination: {
        page: state.pagination.page,
        pageSize: state.pagination.pageSize
      },
      sort: this.buildSort(state.sort),
      filters: state.filters,
      columns: this.getVisibleColumns(),
      include: this.getRelations(),
      groupBy: this.getGroupBy(),
      aggregates: this.getAggregates()
    };
  }

  applySort(column: string, direction: SortState['direction']): SortState[] {
    if (!this.config.sorting?.enabled) {
      return [];
    }

    if (this.config.sorting.multiColumn) {
      return this.updateMultiSort(column, direction);
    } else {
      return [{ column, direction }];
    }
  }

  private buildSort(sortStates: SortState[]): SortState[] {
    if (!this.config.sorting?.enabled || sortStates.length === 0) {
      return this.config.sorting?.defaultSort 
        ? [this.config.sorting.defaultSort]
        : [];
    }

    return sortStates.filter(sort => {
      const column = this.config.columns.find(col => col.id === sort.column);
      return column?.sortable;
    });
  }

  private updateMultiSort(column: string, direction: SortState['direction']): SortState[] {
    const currentSort = this.getCurrentSort();
    const existingIndex = currentSort.findIndex(sort => sort.column === column);

    if (existingIndex >= 0) {
      if (direction === 'asc' && currentSort[existingIndex].direction === 'desc') {
        currentSort.splice(existingIndex, 1);
      } else {
        currentSort[existingIndex].direction = direction;
      }
    } else {
      currentSort.push({ column, direction });
    }

    return currentSort.slice(0, 3);
  }

  private getCurrentSort(): SortState[] {
    return [];
  }

  private getVisibleColumns(): string[] {
    return this.config.columns
      .filter(column => column.visible)
      .map(column => column.id);
  }

  private getRelations(): string[] {
    return [];
  }

  private getGroupBy(): string[] {
    return this.config.columns
      .filter(column => column.groupable)
      .map(column => column.id);
  }

  private getAggregates(): Record<string, string> {
    return {};
  }
}