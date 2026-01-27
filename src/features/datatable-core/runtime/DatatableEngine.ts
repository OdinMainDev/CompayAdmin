import type { DatatableConfig } from '@/features/datatable-core/domain/entities/DatatableConfig';
import type { DatatableState } from '@/features/datatable-core/domain/entities/DatatableState';
import type { FilterCondition } from '@/features/datatable-core/domain/value-objects/FilterCondition';
import type { IDatatableBackend } from '@/features/datatable-core/domain/ports/IDatatableBackend';
import type { IDatatableEventEmitter } from '@/features/datatable-core/domain/ports/IDatatableEventEmitter';
import { QueryBuilder } from './QueryBuilder';
import { StateManager } from './StateManager';
import { FilterManager } from './FilterManager';
import type { SortState } from '@/features/datatable-core/domain/value-objects/SortDirection';
import { IFilter } from '../domain/entities/IFilterResponse';
import { IRequestOptions } from '../domain/entities/DatatableRequest';
import { ApiDatatableQuery } from '../domain/entities/DatatableQuery';
import { ApiError } from '@/features/api-client/types/core';

export class DatatableEngine<T> {
  private config: DatatableConfig<T>;
  private backend: IDatatableBackend<T>;
  private eventEmitter: IDatatableEventEmitter;
  private queryBuilder: QueryBuilder<T>;
  private stateManager: StateManager<T>;
  private filterManager: FilterManager<T>;

  constructor(
    config: DatatableConfig<T>,
    backend: IDatatableBackend<T>,
    eventEmitter: IDatatableEventEmitter,
  ) {
    this.config = config;
    this.backend = backend;
    this.eventEmitter = eventEmitter;
    this.queryBuilder = new QueryBuilder(config);
    this.stateManager = new StateManager<T>(config);
    this.filterManager = new FilterManager(config);
  }

  async initialize(): Promise<DatatableState<T>> {
    const initialState = this.stateManager.getInitialState();
    const filters = await this.loadFilters();
    this.stateManager.setRemoteFilters(filters);
    await this.loadData(initialState);
    return this.stateManager.getState();
  }

  async loadFilters(): Promise<IFilter[]> {
    this.stateManager.setLoading(true);
    const response = await this.backend.fetchFilters();
    this.stateManager.setLoading(false);
    if ('success' in response && response.success) {
      return response.data;
    }
    return [];
  }

  mapFilters(typeFilters?: FilterCondition[]): Record<string, unknown> {
    return (
      typeFilters?.reduce(
        (acc, filter) => {
          if (
            typeof filter.value === 'object' &&
            filter.value !== null &&
            'from' in filter.value &&
            'to' in filter.value
          ) {
            acc[`${filter.field}_from`] = (filter.value as { from: unknown; to: unknown }).from;
            acc[`${filter.field}_to`] = (filter.value as { from: unknown; to: unknown }).to;
          } else {
            acc[filter.field] = filter.value;
          }
          return acc;
        },
        {} as Record<string, unknown>,
      ) ?? {}
    );
  }

  mapDatatableQueryToRequest(query: ApiDatatableQuery): IRequestOptions {
    return {
      start: query.start,
      length: query.length,
      order_column: query.order_column,
      order_direction: query.order_direction,
      filters: this.mapFilters(query.filters),
    };
  }

  async loadData(state: DatatableState<T>): Promise<void> {
    this.stateManager.setLoading(true);

    try {
      const query = this.queryBuilder.build(state);

      const response = await this.backend.fetch(this.mapDatatableQueryToRequest(query));

      if (!('success' in response) || !response.success) {
        const error = response as ApiError;
        this.stateManager.setError(error);
        this.eventEmitter.emit('data-error', { error });
        return;
      }

      this.stateManager.updateData(
        response.data.data,
        response.data.recordsTotal,
        response.data.recordsFiltered,
      );

      this.stateManager.setLoading(false);
      this.eventEmitter.emit('data-loaded', {
        data: response.data,
        total: response.data.recordsTotal,
      });
    } catch (error) {
      this.stateManager.setError(error instanceof Error ? error : new Error('Unknown error'));
      this.eventEmitter.emit('data-error', { error });
    } finally {
      this.stateManager.setLoading(false);
    }
  }

  async sort(column: string, direction: SortState['direction']): Promise<void> {
    const newSort = this.queryBuilder.applySort(column, direction);
    this.stateManager.setSort(newSort);
    await this.loadData(this.stateManager.getState());
    this.eventEmitter.emit('sort-changed', { sort: newSort });
  }

  async filter(filters: FilterCondition[]): Promise<void> {
    const normalizedFilters = this.filterManager.normalize(filters);
    this.stateManager.setFilters(normalizedFilters);
    this.stateManager.resetPagination();
    await this.loadData(this.stateManager.getState());
    this.eventEmitter.emit('filter-changed', { filters: normalizedFilters });
  }

  async changePage(page: number): Promise<void> {
    this.stateManager.setPage(page);
    await this.loadData(this.stateManager.getState());
    this.eventEmitter.emit('page-changed', { page });
  }

  async changePageSize(pageSize: number): Promise<void> {
    this.stateManager.setPageSize(pageSize);
    await this.loadData(this.stateManager.getState());
    this.eventEmitter.emit('page-size-changed', { pageSize });
  }

  selectRows(ids: string[]): void {
    this.stateManager.setSelection(new Set(ids));
    const selectedRows = this.getSelectedRows();
    this.eventEmitter.emit('selection-changed', { selectedRows });
  }

  async executeAction(actionId: string, formData?: Record<string, unknown>): Promise<void> {
    const selectedRows = this.getSelectedRows();
    try {
      const result = await this.backend.executeAction(actionId, {
        ...formData,
        selectedIds: Array.from(this.stateManager.getState().data),
      });

      this.eventEmitter.emit('action-executed', { actionId, result, selectedRows });

      if (this.shouldReloadAfterAction(actionId)) {
        await this.loadData(this.stateManager.getState());
      }
    } catch (error) {
      this.eventEmitter.emit('action-error', { actionId, error });
      throw error;
    }
  }

  private shouldReloadAfterAction(actionId: string): boolean {
    const reloadActions = ['delete', 'update', 'bulk-update'];
    return reloadActions.some((pattern) => actionId.includes(pattern));
  }

  updateColumnVisibility(columnId: string, visible: boolean): void {
    this.stateManager.updateColumnVisibility(columnId, visible);
    this.eventEmitter.emit('column-visibility-changed', {
      columnId,
      visible,
      columnState: this.getState().columnState,
    });
  }
  getSelectedRows(): T[] {
    const state = this.stateManager.getState();
    return state.data.filter((row) => {
      const rowId = (row as { id: string }).id;
      return state.selection.has(rowId);
    });
  }

  getState(): DatatableState<T> {
    return this.stateManager.getState();
  }

  getStateManager(): StateManager<T> {
    return this.stateManager;
  }
  getConfig(): DatatableConfig<T> {
    return this.config;
  }

  subscribe(callback: () => void): () => void {
    return this.stateManager.subscribe(callback);
  }
}
