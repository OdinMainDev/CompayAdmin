import type { DatatableConfig } from '../domain/entities/DatatableConfig';
import type { DatatableState } from '../domain/entities/DatatableState';
import type { FilterCondition } from '../domain/value-objects/FilterCondition';
import type { IDatatableBackend } from '../domain/ports/IDatatableBackend';
import type { IDatatableEventEmitter } from '../domain/ports/IDatatableEventEmitter';
import { QueryBuilder } from './QueryBuilder';
import { StateManager } from './StateManager';
import { FilterManager } from './FilterManager';
import type { SortState } from '../domain/value-objects/SortDirection';
import type { IDatatableFormBuilder } from '../domain/ports/IDatatableFormBuilder';

export class DatatableEngine<T = unknown> {
  private config: DatatableConfig<T>;
  private backend: IDatatableBackend<T>;
  private eventEmitter: IDatatableEventEmitter;
  private queryBuilder: QueryBuilder<T>;
  private stateManager: StateManager<T>;
  private filterManager: FilterManager<T>;
  private formBuilder: IDatatableFormBuilder<T>;

  constructor(
    config: DatatableConfig<T>,
    backend: IDatatableBackend<T>,
    eventEmitter: IDatatableEventEmitter,
    formBuilder: IDatatableFormBuilder<T>

  ) {
    this.config = config;
    this.backend = backend;
    this.eventEmitter = eventEmitter;
    this.formBuilder = formBuilder; 
    this.queryBuilder = new QueryBuilder(config);
    this.stateManager = new StateManager<T>(config);
    this.filterManager = new FilterManager(config);

  }

  async initialize(): Promise<DatatableState<T>> {
    const initialState = this.stateManager.getInitialState();
    await this.loadData(initialState);
    return this.stateManager.getState();
  }

  async loadData(state: DatatableState<T>): Promise<void> {
    this.stateManager.setLoading(true);
    
    try {
      const query = this.queryBuilder.build(state);
      const response = await this.backend.fetch(query);
      
      this.stateManager.updateData(response.data, response.total, response.filtered);
      this.eventEmitter.emit('data-loaded', { data: response.data, total: response.total });
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

  async search(term: string): Promise<void> {
    const searchFilters = this.filterManager.createSearchFilters(term, this.config.columns);
    await this.filter(searchFilters);
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

  getSelectedRows(): T[] {
    const state = this.stateManager.getState();
    return state.data.filter(row => {
      const rowId = (row as { id: string }).id;
      return state.selection.has(rowId);
    });
  }

  async executeAction(actionId: string, formData?: Record<string, unknown>): Promise<void> {
    const selectedRows = this.getSelectedRows();
    
    try {
      const result = await this.backend.executeAction(actionId, {
        ...formData,
        selectedIds: Array.from(this.stateManager.getState().selection)
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
    return reloadActions.some(pattern => actionId.includes(pattern));
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

  getFormBuilder(): IDatatableFormBuilder<T> {
    return this.formBuilder;
  }
}