import type { DatatableConfig } from "../domain/entities/DatatableConfig";
import type { DatatableState } from "../domain/entities/DatatableState";
import type { FilterCondition } from "../domain/value-objects/FilterCondition";
import type { SortState } from "../domain/value-objects/SortDirection";

export class StateManager<T> {
  private state: DatatableState<T>;

  constructor(private config: DatatableConfig<T>) {
    this.state = this.createInitialState();
  }

  private createInitialState(): DatatableState<T> {
    const pageSize = this.config.pagination?.pageSize || 10;
    
    return {
      data: [],
      total: 0,
      filtered: 0,
      loading: false,
      error: null,
      selection: new Set(),
      sort: this.config.sorting?.defaultSort ? [this.config.sorting.defaultSort] : [],
      filters: [],
      pagination: {
        page: 1,
        pageSize,
        totalPages: 0
      },
      columnState: {
        order: this.config.columns.map(col => col.id),
        visibility: this.config.columns.reduce((acc, col) => ({
          ...acc,
          [col.id]: col.visible
        }), {}),
        widths: {}
      },
      formState: {
        filterForm: {},
        actionForms: {}
      }
    };
  }

  getInitialState(): DatatableState<T> {
    return this.createInitialState();
  }

  getState(): DatatableState<T> {
    return { ...this.state };
  }

  setState(newState: Partial<DatatableState<T>>): void {
    this.state = { ...this.state, ...newState };
  }

  updateData(data: T[], total: number, filtered?: number): void {
    this.state.data = data;
    this.state.total = total;
    this.state.filtered = filtered || total;
    this.state.pagination.totalPages = Math.ceil(this.state.filtered / this.state.pagination.pageSize);
  }

  setLoading(loading: boolean): void {
    this.state.loading = loading;
  }

  setError(error: Error | null): void {
    this.state.error = error;
  }

  setSort(sort: SortState[]): void {
    this.state.sort = sort;
  }

  setFilters(filters: FilterCondition[]): void {
    this.state.filters = filters;
  }

  setPage(page: number): void {
    this.state.pagination.page = page;
  }

  setPageSize(pageSize: number): void {
    this.state.pagination.pageSize = pageSize;
    this.state.pagination.page = 1;
  }

  resetPagination(): void {
    this.state.pagination.page = 1;
  }

  setSelection(selection: Set<string>): void {
    this.state.selection = selection;
  }

  updateColumnOrder(order: string[]): void {
    this.state.columnState.order = order;
  }

  updateColumnVisibility(columnId: string, visible: boolean): void {
    this.state.columnState.visibility[columnId] = visible;
  }

  updateColumnWidth(columnId: string, width: number): void {
    this.state.columnState.widths[columnId] = width;
  }

  updateFilterForm(data: Record<string, unknown>): void {
    this.state.formState.filterForm = { ...this.state.formState.filterForm, ...data };
  }

  updateActionForm(actionId: string, data: Record<string, unknown>): void {
    this.state.formState.actionForms[actionId] = {
      ...this.state.formState.actionForms[actionId],
      ...data
    };
  }

  clearSelection(): void {
    this.state.selection.clear();
  }

  toggleRowSelection(rowId: string): void {
    if (this.state.selection.has(rowId)) {
      this.state.selection.delete(rowId);
    } else {
      this.state.selection.add(rowId);
    }
  }

  selectAll(): void {
    const allIds = this.state.data.map(row => (row as { id: string }).id);
    this.state.selection = new Set(allIds);
  }

  deselectAll(): void {
    this.state.selection.clear();
  }
}