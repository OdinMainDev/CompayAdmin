import type { ApiDatatableQuery } from "@/features/datatable-core/domain/entities/DatatableQuery";
import type { IResponseList } from "@/features/datatable-core/domain/entities/DatatableResponse";
import type { FilterDefinition } from "@/features/datatable-core/domain/entities/FilterDefinition";


export interface IDatatableBackend<T> {
  fetch(query: ApiDatatableQuery): Promise<IResponseList<T>>;
  fetchFilters(): Promise<FilterDefinition[]>;
  export(query: ApiDatatableQuery, format: string): Promise<unknown>;
  executeAction(actionId: string, data: Record<string, unknown>): Promise<unknown>;
}