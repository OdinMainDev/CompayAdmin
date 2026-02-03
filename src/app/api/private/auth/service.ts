import Cookies from 'js-cookie';
import { apiClient } from '@/features/api-client/client';
import type { LoginRequest, LoginResponse, TotpResponse } from './types';
import { ApiError } from '@/features/api-client/types/core';
import { RequestOptions } from '@/features/api-client/types/request';
import { COOKIE_AUTH_NAME } from '@/constants';
import { makeError } from '@/features/api-client/types/utils';

export class AuthService {
  private static readonly ENDPOINTS = {
    LOGIN: '/api/auth/login',
    TOTP: '/api/auth/totp',
  } as const;

  static async login(
    credentials: LoginRequest,
    options: Omit<RequestOptions<LoginRequest>, 'method' | 'body'> = {},
  ): Promise<LoginResponse | ApiError> {
    try {
      const response = await apiClient.post<LoginResponse>(this.ENDPOINTS.LOGIN, credentials, {
        ...options,
        isAuth: false,
        hasToast: options.hasToast ?? true,
      });

      if (!response.success) {
        return response;
      }

      Cookies.set(COOKIE_AUTH_NAME, response.data.token);
      return response.data;
    } catch (error) {
      return makeError('Login failed', error);
    }
  }

  static async totp(code: string, options?: RequestOptions): Promise<TotpResponse | ApiError> {
    try {
      return await apiClient.post<TotpResponse['data']>(
        `${this.ENDPOINTS.TOTP}`,
        { code },
        {
          ...options,
          isAuth: true,
          hasToast: true,
        },
      );
    } catch (error) {
      return makeError('Totp failed', error);
    }
  }
}
