import { apiClient } from '@/features/api-client/client';
import type {
  Profile2FAActivateRequest,
  Profile2FAActivateResponse,
  Profile2FAResponse,
  ProfileRequest,
  ProfileResponse,
} from './types';
import { RequestOptions } from '@/features/api-client/types/request';
import { ApiError } from '@/features/api-client/types/core';
import { makeError } from '@/features/api-client/types/utils';

export class ProfileService {
  private static readonly ENDPOINTS = {
    GET: '/api/panel/profile/get',
    UPDATE: '/api/panel/profile/process',
    TOTP_URI: '/api/panel/profile/totp-uri',
    TOTP_ACTIVATE: '/api/panel/profile/totp-activate',
  } as const;

  static async get(
    options: Omit<RequestOptions, 'method' | 'body'> = {},
  ): Promise<ProfileResponse | ApiError> {
    try {
      return await apiClient.post<ProfileResponse['data']>(
        this.ENDPOINTS.GET,
        {},
        {
          ...options,
          isAuth: true,
          hasToast: options.hasToast ?? false,
        },
      );
    } catch (error) {
      return makeError('Failed to fetch current profile', error);
    }
  }

  static async update(
    data: ProfileRequest,
    options?: RequestOptions,
  ): Promise<ProfileResponse | ApiError> {
    try {
      return await apiClient.post<ProfileResponse['data']>(`${this.ENDPOINTS.UPDATE}`, data, {
        ...options,
        isAuth: true,
        hasToast: options?.hasToast ?? true,
      });
    } catch (error) {
      return makeError('Failed to update profile', error);
    }
  }

  static async get2FAURI(options?: RequestOptions): Promise<Profile2FAResponse | ApiError> {
    try {
      return await apiClient.post<Profile2FAResponse['data']>(
        `${this.ENDPOINTS.TOTP_URI}`,
        {},
        {
          ...options,
          isAuth: true,
          hasToast: true,
        },
      );
    } catch (error) {
      return makeError('Failed to get totp uri', error);
    }
  }

  static async activate2FA(
    data: Profile2FAActivateRequest,
    options?: RequestOptions,
  ): Promise<Profile2FAActivateResponse | ApiError> {
    try {
      return await apiClient.post<Profile2FAActivateResponse>(
        `${this.ENDPOINTS.TOTP_ACTIVATE}`,
        data,
        {
          ...options,
          isAuth: true,
          hasToast: options?.hasToast ?? true,
        },
      );
    } catch (error) {
      return makeError('Failed to activate 2fa', error);
    }
  }
}
