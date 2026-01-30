import type { GetCountries, GetCurrencyNetworks } from './types';
import { RequestOptions } from '@/features/api-client/types/request';
import { ApiError } from '@/features/api-client/types/core';
import { apiClient } from '@/features/api-client/client';
import { makeError } from '@/features/api-client/types/utils';

export class ApiService {
  private static readonly ENDPOINTS = {
    CURRENCY_NETWORKS: '/api/panel/get/data/currency/networks',
    COUNTRIES: '/api/panel/get/data/countries',
  } as const;

  static async getCurrencyNetworks(
    options?: RequestOptions,
  ): Promise<GetCurrencyNetworks | ApiError> {
    try {
      return await apiClient.post<GetCurrencyNetworks['data']>(
        `${this.ENDPOINTS.CURRENCY_NETWORKS}`,
        {},
        {
          ...options,
          isAuth: true,
          hasToast: options?.hasToast ?? false,
        },
      );
    } catch (error) {
      return makeError('Failed to fetch currency networks', error);
    }
  }

  static async getCountries(options?: RequestOptions): Promise<GetCountries | ApiError> {
    try {
      return await apiClient.post<GetCountries['data']>(
        `${this.ENDPOINTS.COUNTRIES}`,
        {},
        {
          ...options,
          isAuth: true,
          hasToast: options?.hasToast ?? false,
        },
      );
    } catch (error) {
      return makeError('Failed to fetch currency networks', error);
    }
  }
}
