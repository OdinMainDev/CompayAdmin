import { API_CONFIG, buildHeaders } from './config';
import { handleResponse } from './responseHandler';
import { ToastService } from './toastService';
import { NetworkError, TimeoutError } from './responseHandler';
import type { 
  ApiResponse 
} from './types/core';
import type { RequestOptions, RequestConfig } from './types/request';

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
    config: RequestConfig<B>
  ): Promise<ApiResponse<T, M, string>> {
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
  
      return hasToast 
        ? ToastService.withToast(Promise.resolve(result))
        : result;
  
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
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      
      if (Array.isArray(value)) {
        value.forEach(item => {
          if (item !== null && item !== undefined) {
            searchParams.append(`${key}[]`, String(item));
          }
        });
      } else {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  get<T, M extends Record<string, unknown> = Record<string, never>>(
    url: string, 
    options: Omit<RequestOptions, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T, M, string>> {
    return this.request<T, M>({ ...options, url, method: 'GET' });
  }

  post<T, M extends Record<string, unknown> = Record<string, never>, B = unknown>(
    url: string, 
    body: B,
    options: Omit<RequestOptions<B>, 'method'> = {}
  ): Promise<ApiResponse<T, M, string>> {
    return this.request<T, M, B>({ ...options, url, method: 'POST', body });
  }

  put<T, M extends Record<string, unknown> = Record<string, never>, B = never>(
    url: string, 
    body: B,
    options: Omit<RequestOptions<B>, 'method'> = {}
  ): Promise<ApiResponse<T, M, string>> {
    return this.request<T, M, B>({ ...options, url, method: 'PUT', body });
  }

  patch<T, M extends Record<string, unknown> = Record<string, never>, B = never>(
    url: string, 
    body: B,
    options: Omit<RequestOptions<B>, 'method'> = {}
  ): Promise<ApiResponse<T, M, string>> {
    return this.request<T, M, B>({ ...options, url, method: 'PATCH', body });
  }

  delete<T, M extends Record<string, unknown> = Record<string, never>>(
    url: string, 
    options: Omit<RequestOptions, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T, M, string>> {
    return this.request<T, M>({ ...options, url, method: 'DELETE' });
  }
}

export const apiClient = ApiClient.getInstance();