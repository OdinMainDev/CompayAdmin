import type { MerchantResponse, MerchantStringResponse, MerchantUpdateRequest } from './types';
import { RequestOptions } from '@/features/api-client/types/request';
import { ApiError } from '@/features/api-client/types/core';
import { apiClient } from '@/features/api-client/client';
import { makeError } from '@/features/api-client/types/utils';

export class MerchantService {
  private static readonly ENDPOINTS = {
    GET: '/api/panel/merchant/merchant/get',
    UPDATE: '/api/panel/merchant/merchant/process',
    GET_TOKEN: '/api/panel/merchant/merchant/action/get-token',
    GENERATE_SECRET: '/api/panel/merchant/merchant/action/generate-secret',
  } as const;

  static async get(options?: RequestOptions): Promise<MerchantResponse | ApiError> {
    try {
      return await apiClient.post<MerchantResponse['data']>(
        `${this.ENDPOINTS.GET}`,
        {},
        {
          ...options,
          isAuth: true,
          hasToast: options?.hasToast ?? false,
        },
      );
    } catch (error) {
      return makeError('Failed to fetch settings', error);
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
      return makeError('Failed to update settings', error);
    }
  }

  static async getToken(options?: RequestOptions): Promise<MerchantStringResponse | ApiError> {
    try {
      return await apiClient.post<MerchantStringResponse['data']>(
        `${this.ENDPOINTS.GET_TOKEN}`,
        {},
        {
          ...options,
          isAuth: true,
          hasToast: true,
        },
      );
    } catch (error) {
      return makeError('Failed to get token', error);
    }
  }

  static async generateSecret(
    options?: RequestOptions,
  ): Promise<MerchantStringResponse | ApiError> {
    try {
      return await apiClient.post<MerchantStringResponse['data']>(
        `${this.ENDPOINTS.GENERATE_SECRET}`,
        {},
        {
          ...options,
          isAuth: true,
          hasToast: true,
        },
      );
    } catch (error) {
      return makeError('Failed to generate secret', error);
    }
  }
}
