import type { ApiDatatableQuery } from "../entities/DatatableQuery";
import type { IResponseList } from "../entities/DatatableResponse";
import type { FilterDefinition } from "../entities/FilterDefinition";


export interface IDatatableBackend<T> {
  fetch(query: ApiDatatableQuery): Promise<IResponseList<T>>;
  fetchFilters(): Promise<FilterDefinition[]>;
  export(query: ApiDatatableQuery, format: string): Promise<unknown>;
  executeAction(actionId: string, data: Record<string, unknown>): Promise<unknown>;
}