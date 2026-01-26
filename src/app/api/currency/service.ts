
import { FilterReponse } from '@/features/api-client/types/datatable';
import type { CurrencyResponse, GetListFiltersResponse } from './types';
import { RequestOptions } from '@/features/api-client/types/request';
import { ApiError } from '@/features/api-client/types/core';
import { apiClient } from '@/features/api-client/client';
import { makeError } from '@/features/api-client/types/utils';
import { IResponseList } from '@/features/datatable-core';
import { Currency } from '@/app/entities/currency';
import { IRequestOptions } from '@/features/datatable-core/domain/entities/DatatableRequest';

export class CurrencyService {
  private static readonly ENDPOINTS = {
    LIST: "/api/panel/admin/dev/currencies/list",
    FILTERS: "/api/panel/admin/dev/currencies/list/filters",
    GET: "/api/panel/admin/dev/currencies/get",
    CREATE: "/api/panel/admin/dev/currencies/process",
    DELETE: "/api/panel/admin/dev/currencies/delete",
    IMPORT:  "/api/panel/admin/dev/currencies/action/import",
  } as const;

  static async getList(
    params: IRequestOptions = {},
    options?: RequestOptions
  ): Promise<IResponseList<Currency> | ApiError> {
    try {
      return await apiClient.post<IResponseList<Currency>["data"]>(
        `${CurrencyService.ENDPOINTS.LIST}`,
        params,
        {
          ...options,
          isAuth: true,
          hasToast: false,
        }
      );
    } catch (error) {
      return makeError("Failed to fetch currencies", error);
    }
  }

  static async getFilters(
    options?: RequestOptions
  ): Promise<GetListFiltersResponse | ApiError> {
    try {
      return await apiClient.post<FilterReponse[]>(`${CurrencyService.ENDPOINTS.FILTERS}`, {
        ...options,
        isAuth: true,
        hasToast: false,
      });
    } catch (error) {
      return makeError("Failed to fetch filters", error);
    }
  }

  static async getById(
      id: number,
      options?: RequestOptions
    ): Promise<CurrencyResponse | ApiError> {
      try {
        return await apiClient.post<CurrencyResponse["data"]>(
          `${this.ENDPOINTS.GET}/${id}`,
          {},
          {
            ...options,
            isAuth: true,
            hasToast: options?.hasToast ?? false,
          }
        );
      } catch (error) {
        return makeError("Failed to fetch currency", error);
      }
  }

  static async delete(
    id: number,
    options?: RequestOptions
  ): Promise<{ success: boolean; message?: string } | ApiError> {
    try {
      return await apiClient.post<null>(
        `${CurrencyService.ENDPOINTS.DELETE}`,
        { id },
        {
          ...options,
          isAuth: true,
          hasToast: options?.hasToast ?? true,
        }
      );
    } catch (error) {
      return makeError("Failed to delete currency", error);
    }
  }

  static async import(
    options?: RequestOptions
  ): Promise<GetListFiltersResponse | ApiError> {
    try {
      return await apiClient.post<FilterReponse[]>(`${CurrencyService.ENDPOINTS.IMPORT}`, {
        ...options,
        isAuth: true,
        hasToast: true,
      });
    } catch (error) {
      return makeError("Failed to fetch filters", error);
    }
  }
}