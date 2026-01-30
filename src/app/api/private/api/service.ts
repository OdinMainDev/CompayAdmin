import type { ActionResponse, GetFeeTypes } from './types';
import { RequestOptions } from '@/features/api-client/types/request';
import { ApiError } from '@/features/api-client/types/core';
import { apiClient } from '@/features/api-client/client';
import { makeError } from '@/features/api-client/types/utils';

export class ApiAdminService {
  private static readonly ENDPOINTS = {
    FEE_TYPES: '/api/panel/admin/get/data/fee-types',
    CLEAR_CACHE: '/api/panel/admin/action/clear-cache',
  } as const;

  static async getFeeTypes(options?: RequestOptions): Promise<GetFeeTypes | ApiError> {
    try {
      return await apiClient.post<GetFeeTypes['data']>(
        `${this.ENDPOINTS.FEE_TYPES}`,
        {},
        {
          ...options,
          isAuth: true,
          hasToast: false,
        },
      );
    } catch (error) {
      return makeError('Failed to fetch currency networks', error);
    }
  }

  static async clearCache(options?: RequestOptions): Promise<ActionResponse | ApiError> {
    try {
      return await apiClient.post<GetFeeTypes['data']>(
        `${this.ENDPOINTS.CLEAR_CACHE}`,
        {},
        {
          ...options,
          isAuth: true,
          hasToast: true,
        },
      );
    } catch (error) {
      return makeError('Failed to clear cache', error);
    }
  }
}
