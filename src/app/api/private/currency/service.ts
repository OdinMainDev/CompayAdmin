import { FilterReponse } from '@/features/api-client/types/datatable';
import type {
  CurrencyProcessRequest,
  CurrencyResponse,
  CurrencySearchRequest,
  CurrencySearchResponse,
  GetListFiltersResponse,
} from './types';
import { RequestOptions } from '@/features/api-client/types/request';
import { ApiError } from '@/features/api-client/types/core';
import { apiClient } from '@/features/api-client/client';
import { makeError } from '@/features/api-client/types/utils';
import { IResponseList } from '@/features/datatable-core';
import { Currency } from '@/app/entities/currency';
import { IRequestOptions } from '@/features/datatable-core/domain/entities/DatatableRequest';

export class CurrencyService {
  private static readonly ENDPOINTS = {
    LIST: '/api/panel/admin/dev/currencies/list',
    FILTERS: '/api/panel/admin/dev/currencies/list/filters',
    GET: '/api/panel/admin/dev/currencies/get',
    PROCESS: '/api/panel/admin/dev/currencies/process',
    SEARCH: '/api/panel/admin/dev/currencies/search',
    IMPORT: '/api/panel/admin/dev/currencies/action/import',
  } as const;

  static async getList(
    params: IRequestOptions = {},
    options?: RequestOptions,
  ): Promise<IResponseList<Currency> | ApiError> {
    try {
      return await apiClient.post<IResponseList<Currency>['data']>(
        `${CurrencyService.ENDPOINTS.LIST}`,
        params,
        {
          ...options,
          isAuth: true,
          hasToast: false,
        },
      );
    } catch (error) {
      return makeError('Failed to fetch currencies', error);
    }
  }

  static async getFilters(options?: RequestOptions): Promise<GetListFiltersResponse | ApiError> {
    try {
      return await apiClient.post<FilterReponse[]>(`${CurrencyService.ENDPOINTS.FILTERS}`, {
        ...options,
        isAuth: true,
        hasToast: false,
      });
    } catch (error) {
      return makeError('Failed to fetch filters', error);
    }
  }

  static async getById(id: number, options?: RequestOptions): Promise<CurrencyResponse | ApiError> {
    try {
      return await apiClient.post<CurrencyResponse['data']>(
        `${this.ENDPOINTS.GET}/${id}`,
        {},
        {
          ...options,
          isAuth: true,
          hasToast: options?.hasToast ?? false,
        },
      );
    } catch (error) {
      return makeError('Failed to fetch currency', error);
    }
  }

  static async process(
    data: CurrencyProcessRequest,
    options?: RequestOptions,
  ): Promise<CurrencyResponse | ApiError> {
    try {
      return await apiClient.post<CurrencyResponse['data']>(`${this.ENDPOINTS.PROCESS}`, data, {
        ...options,
        isAuth: true,
        hasToast: options?.hasToast ?? true,
      });
    } catch (error) {
      return makeError('Failed to process currency', error);
    }
  }

  static async search(
    data: CurrencySearchRequest,
    options?: RequestOptions,
  ): Promise<CurrencySearchResponse | ApiError> {
    try {
      return await apiClient.post<CurrencySearchResponse['data']>(
        `${this.ENDPOINTS.SEARCH}`,
        { ...data },
        {
          ...options,
          isAuth: true,
          hasToast: options?.hasToast ?? false,
        },
      );
    } catch (error) {
      return makeError('Failed to search merchants', error);
    }
  }

  static async import(options?: RequestOptions): Promise<GetListFiltersResponse | ApiError> {
    try {
      return await apiClient.post(
        `${this.ENDPOINTS.IMPORT}`,
        {},
        {
          ...options,
          isAuth: true,
          hasToast: true,
        },
      );
    } catch (error) {
      return makeError('Failed to fetch filters', error);
    }
  }
}
