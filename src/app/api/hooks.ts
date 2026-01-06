import { useCallback, useState, useRef } from 'react';
import { apiClient } from './client';
import { ToastService } from './toastService';
import type { ApiResponseError, NetworkError, TimeoutError } from './responseHandler';
import type { ApiError, ApiResponse, SuccessResponse } from './types/core';
import type { RequestOptions } from './types/request';

interface UseApiRequestState<T, M extends Record<string, unknown>> {
  readonly data: SuccessResponse<T, M> | null;
  readonly error: ApiError<string> | null;
  readonly isLoading: boolean;
  readonly isSuccess: boolean;
  readonly isError: boolean;
}

interface UseApiRequestReturn<T, M extends Record<string, unknown>, B> 
  extends UseApiRequestState<T, M> {
  readonly execute: (
    url: string, 
    options?: RequestOptions<B>
  ) => Promise<ApiResponse<T, M, string>>;
  readonly reset: () => void;
  readonly mutate: (updater: (data: T) => T) => void;
}

export const useApiRequest = <
  T, 
  M extends Record<string, unknown> = Record<string, never>, 
  B = never
>(): UseApiRequestReturn<T, M, B> => {
  const [state, setState] = useState<UseApiRequestState<T, M>>({
    data: null,
    error: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(async (
    url: string,
    options: RequestOptions<B> = {}
  ): Promise<ApiResponse<T, M, string>> => {
    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setState(prev => ({
      ...prev,
      isLoading: true,
      isSuccess: false,
      isError: false,
      error: null,
    }));

    try {
      const response = await apiClient.request<T, M, B>({
        url,
        ...options,
        signal: controller.signal,
      });

      if (controller.signal.aborted) {
        throw new DOMException('Request aborted', 'AbortError');
      }

      if (isApiError(response)) {
        setState({
          data: null,
          error: response,
          isLoading: false,
          isSuccess: false,
          isError: true,
        });
        
        if (options.hasToast) {
          ToastService.error(response.error);
        }
        
        return response;
      }

      setState({
        data: response,
        error: null,
        isLoading: false,
        isSuccess: true,
        isError: false,
      });

      if (options.hasToast) {
        ToastService.success('Success');
      }

      return response;

    } catch (error) {
      if (controller.signal.aborted) {
        return { success: false, error: 'Request cancelled', errors: {} };
      }

      const apiError: ApiError<string> = error instanceof ApiResponseError
        ? { success: false, error: error.error.error, errors: error.error.errors }
        : error instanceof NetworkError
        ? { success: false, error: error.message, errors: {} }
        : error instanceof TimeoutError
        ? { success: false, error: 'Request timeout', errors: {} }
        : { success: false, error: 'Unknown error occurred', errors: {} };

      setState({
        data: null,
        error: apiError,
        isLoading: false,
        isSuccess: false,
        isError: true,
      });

      if (options.hasToast) {
        ToastService.error(apiError.error);
      }

      return apiError;
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
    });
  }, []);

  const mutate = useCallback((updater: (data: T) => T) => {
    setState(prev => {
      if (!prev.data) return prev;
      
      return {
        ...prev,
        data: {
          ...prev.data,
          data: updater(prev.data.data),
        },
      };
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
    mutate,
  };
};

// Хук для конкретного API
export const useApi = () => {
  const request = useApiRequest();

  return {
    ...request,
    get: <T, M extends Record<string, unknown> = Record<string, never>>(
      url: string, 
      options?: Omit<RequestOptions, 'method' | 'body'>
    ) => request.execute<T, M>(url, { ...options, method: 'GET' }),

    post: <T, M extends Record<string, unknown> = Record<string, never>, B = never>(
      url: string, 
      body: B,
      options?: Omit<RequestOptions<B>, 'method'>
    ) => request.execute<T, M, B>(url, { ...options, method: 'POST', body }),

    put: <T, M extends Record<string, unknown> = Record<string, never>, B = never>(
      url: string, 
      body: B,
      options?: Omit<RequestOptions<B>, 'method'>
    ) => request.execute<T, M, B>(url, { ...options, method: 'PUT', body }),

    patch: <T, M extends Record<string, unknown> = Record<string, never>, B = never>(
      url: string, 
      body: B,
      options?: Omit<RequestOptions<B>, 'method'>
    ) => request.execute<T, M, B>(url, { ...options, method: 'PATCH', body }),

    delete: <T, M extends Record<string, unknown> = Record<string, never>>(
      url: string, 
      options?: Omit<RequestOptions, 'method' | 'body'>
    ) => request.execute<T, M>(url, { ...options, method: 'DELETE' }),
  };
};