
import { FilterReponse } from '@/features/api-client/types/datatable';
import type { GetListFiltersResponse } from './types';
import { RequestOptions } from '@/features/api-client/types/request';
import { ApiError } from '@/features/api-client/types/core';
import { apiClient } from '@/features/api-client/client';
import { makeError } from '@/features/api-client/types/utils';
import { IResponseList } from '@/features/datatable-core';
import { LogUser } from '@/app/entities/loguser';
import { IRequestOptions } from '@/features/datatable-core/domain/entities/DatatableRequest';

export class LogUserService {
  private static readonly ENDPOINTS = {
    LIST: "/api/panel/admin/dev/logs/user/list",
    FILTERS: "/api/panel/admin/dev/logs/user/list/filters",
  } as const;

  static async getList(
    params: IRequestOptions = {},
    options?: RequestOptions
  ): Promise<IResponseList<LogUser> | ApiError> {
    try {
      return await apiClient.post<IResponseList<LogUser>["data"]>(
        `${LogUserService.ENDPOINTS.LIST}`,
        params,
        {
          ...options,
          isAuth: true,
          hasToast: options?.hasToast ?? false,
        }
      );
    } catch (error) {
      return makeError("Failed to fetch loguser", error);
    }
  }

  static async getFilters(
    options?: RequestOptions
  ): Promise<GetListFiltersResponse | ApiError> {
    try {
      return await apiClient.post<FilterReponse[]>(`${LogUserService.ENDPOINTS.FILTERS}`, {
        ...options,
        isAuth: true,
        hasToast: options?.hasToast ?? false,
      });
    } catch (error) {
      return makeError("Failed to fetch filters", error);
    }
  }
}