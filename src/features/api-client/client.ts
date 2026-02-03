import { API_CONFIG, buildHeaders } from './config';
import { handleResponse } from './responseHandler';
import { ToastService } from './toastService';
import { NetworkError, TimeoutError } from './responseHandler';
import type { ApiResponse } from './types/core';
import type { RequestOptions, RequestConfig } from './types/request';
import { fingerprintService } from './fingerprint';

export class ApiClient {
  private static instance: ApiClient;
  private constructor() {}

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  async request<T, M extends Record<string, unknown> = Record<string, never>, B = unknown>(
    config: RequestConfig<B>,
  ): Promise<ApiResponse<T, M>> {
    const {
      url,
      method = 'GET',
      isAuth = true,
      body,
      hasToast = false,
      headers: customHeaders = {},
      timeout = API_CONFIG.TIMEOUT,
      params = {},
    } = config;

    const queryString = this.buildQueryString(params);
    const fullUrl = `${API_CONFIG.BASE_URL}${url}${queryString}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(fullUrl, {
        method,
        headers: buildHeaders(isAuth, customHeaders),
        body: body !== undefined && body !== null ? JSON.stringify(body) : null,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const result = await handleResponse<T, M>(response);

      return hasToast ? ToastService.withToast(Promise.resolve(result)) : result;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new TimeoutError();
      }

      if (error instanceof Error) {
        throw new NetworkError(error.message);
      }

      throw new NetworkError('Unknown network error occurred');
    }
  }
  private buildQueryString(params: Readonly<Record<string, unknown>>): string {
    const searchParams = new URLSearchParams();

    const serializeValue = (value: unknown): string => {
      if (value instanceof Date) {
        return value.toISOString();
      }
      if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value);
      }
      return String(value);
    };

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item !== null && item !== undefined) {
            searchParams.append(`${key}[]`, serializeValue(item));
          }
        });
      } else {
        searchParams.append(key, serializeValue(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }
  get<T, M extends Record<string, unknown> = Record<string, never>>(
    url: string,
    options: Omit<RequestOptions, 'method' | 'body'> = {},
  ): Promise<ApiResponse<T, M>> {
    return this.request<T, M>({ ...options, url, method: 'GET' });
  }

  async post<T, M extends Record<string, unknown> = Record<string, never>, B = unknown>(
    url: string,
    body: B,
    options: Omit<RequestOptions<B>, 'method'> = {},
  ): Promise<ApiResponse<T, M>> {
    const enrichedBody =
      (options?.withFingerprint ?? true) ? { ...body, fp: await fingerprintService.get() } : body;
    return this.request<T, M, B>({
      ...options,
      url,
      method: 'POST',
      body: enrichedBody,
    });
  }

  put<T, M extends Record<string, unknown> = Record<string, never>, B = never>(
    url: string,
    body: B,
    options: Omit<RequestOptions<B>, 'method'> = {},
  ): Promise<ApiResponse<T, M>> {
    return this.request<T, M, B>({ ...options, url, method: 'PUT', body });
  }

  patch<T, M extends Record<string, unknown> = Record<string, never>, B = never>(
    url: string,
    body: B,
    options: Omit<RequestOptions<B>, 'method'> = {},
  ): Promise<ApiResponse<T, M>> {
    return this.request<T, M, B>({ ...options, url, method: 'PATCH', body });
  }

  delete<T, M extends Record<string, unknown> = Record<string, never>>(
    url: string,
    options: Omit<RequestOptions, 'method' | 'body'> = {},
  ): Promise<ApiResponse<T, M>> {
    return this.request<T, M>({ ...options, url, method: 'DELETE' });
  }
}

export const apiClient = ApiClient.getInstance();
