import type { DatatableQuery } from "../entities/DatatableQuery";
import type { DatatableResponse } from "../entities/DatatableResponse";
import type { FilterDefinition } from "../entities/FilterDefinition";


export interface IDatatableBackend<T> {
  fetch(query: DatatableQuery): Promise<DatatableResponse<T>>;
  fetchFilters(): Promise<FilterDefinition[]>;
  exportData(query: DatatableQuery, format: string): Promise<Blob>;
  executeAction(actionId: string, data: Record<string, unknown>): Promise<unknown>;
}