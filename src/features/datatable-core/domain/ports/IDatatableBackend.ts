import { ApiError } from "@/features/api-client/types/core";
import type { ApiDatatableQuery } from "@/features/datatable-core/domain/entities/DatatableQuery";
import type { IResponseList } from "@/features/datatable-core/domain/entities/DatatableResponse";
import { IFilterResponse } from "../entities/IFilterResponse";
import { IRequestOptions } from "../entities/DatatableRequest";


export interface IDatatableBackend<T> {
  fetch(query: IRequestOptions): Promise<IResponseList<T> | ApiError>;
  fetchFilters(): Promise<IFilterResponse | ApiError>;
  export(query: ApiDatatableQuery, format: string): Promise<unknown>;
  executeAction(actionId: string, data: Record<string, unknown>): Promise<unknown>;
}