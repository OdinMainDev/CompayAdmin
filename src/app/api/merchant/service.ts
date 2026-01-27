import { FilterReponse } from '@/features/api-client/types/datatable';
import type {
  GetListFiltersResponse,
  MerchantCreateRequest,
  MerchantResponse,
  MerchantSearchRequest,
  MerchantSearchResponse,
  MerchantUpdateRequest,
} from './types';
import { RequestOptions } from '@/features/api-client/types/request';
import { ApiError } from '@/features/api-client/types/core';
import { apiClient } from '@/features/api-client/client';
import { makeError } from '@/features/api-client/types/utils';
import { IResponseList } from '@/features/datatable-core';
import { Merchant } from '@/app/entities/merchant';
import { IRequestOptions } from '@/features/datatable-core/domain/entities/DatatableRequest';

export class MerchantService {
  private static readonly ENDPOINTS = {
    LIST: '/api/panel/admin/dev/merchants/list',
    FILTERS: '/api/panel/admin/dev/merchants/list/filters',
    GET: '/api/panel/admin/dev/merchants/get',
    CREATE: '/api/panel/admin/dev/merchants/create',
    UPDATE: '/api/panel/admin/dev/merchants/update',
    DELETE: '/api/panel/admin/dev/merchants/delete',
    SEARCH: '/api/panel/admin/dev/merchants/search',
  } as const;

  static async getList(
    params: IRequestOptions = {},
    options?: RequestOptions,
  ): Promise<IResponseList<Merchant> | ApiError> {
    try {
      return await apiClient.post<IResponseList<Merchant>['data']>(
        `${MerchantService.ENDPOINTS.LIST}`,
        params,
        {
          ...options,
          isAuth: true,
          hasToast: options?.hasToast ?? false,
        },
      );
    } catch (error) {
      return makeError('Failed to fetch merchants', error);
    }
  }

  static async getFilters(options?: RequestOptions): Promise<GetListFiltersResponse | ApiError> {
    try {
      return await apiClient.post<FilterReponse[]>(`${MerchantService.ENDPOINTS.FILTERS}`, {
        ...options,
        isAuth: true,
        hasToast: options?.hasToast ?? false,
      });
    } catch (error) {
      return makeError('Failed to fetch filters', error);
    }
  }

  static async getById(id: number, options?: RequestOptions): Promise<MerchantResponse | ApiError> {
    try {
      return await apiClient.post<MerchantResponse['data']>(
        `${this.ENDPOINTS.GET}/${id}`,
        {},
        {
          ...options,
          isAuth: true,
          hasToast: options?.hasToast ?? false,
        },
      );
    } catch (error) {
      return makeError('Failed to fetch merchant', error);
    }
  }

  static async create(
    data: MerchantCreateRequest,
    options?: RequestOptions,
  ): Promise<MerchantResponse | ApiError> {
    try {
      return await apiClient.post<MerchantResponse['data']>(`${this.ENDPOINTS.CREATE}`, data, {
        ...options,
        isAuth: true,
        hasToast: options?.hasToast ?? true,
      });
    } catch (error) {
      return makeError('Failed to create merchant', error);
    }
  }

  static async update(
    data: MerchantUpdateRequest,
    options?: RequestOptions,
  ): Promise<MerchantResponse | ApiError> {
    try {
      return await apiClient.post<MerchantResponse['data']>(`${this.ENDPOINTS.UPDATE}`, data, {
        ...options,
        isAuth: true,
        hasToast: options?.hasToast ?? true,
      });
    } catch (error) {
      return makeError('Failed to update merchant', error);
    }
  }

  static async delete(
    id: number,
    options?: RequestOptions,
  ): Promise<{ success: boolean; message?: string } | ApiError> {
    try {
      return await apiClient.post<null>(
        `${this.ENDPOINTS.DELETE}`,
        { id },
        {
          ...options,
          isAuth: true,
          hasToast: options?.hasToast ?? true,
        },
      );
    } catch (error) {
      return makeError('Failed to delete merchant', error);
    }
  }

  static async search(
    data: MerchantSearchRequest,
    options?: RequestOptions,
  ): Promise<MerchantSearchResponse | ApiError> {
    try {
      return await apiClient.post<MerchantSearchResponse['data']>(
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
}
