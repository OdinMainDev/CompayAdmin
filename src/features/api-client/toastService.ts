import i18next from 'i18next';
import { toast, type ToastContent, type ToastOptions } from 'react-toastify';
import type { ApiError, SuccessResponse } from './types/core';
import { isApiError } from './responseHandler';

export interface ToastConfig {
  readonly success?: string;
  readonly error?: string;
  readonly pending?: string;
  readonly options?: ToastOptions;
}

export class ToastService {
  private static readonly DEFAULT_CONFIG: ToastConfig = {
    success: i18next.t('toasts.success'),
    error: i18next.t('toasts.fail'),
    pending: i18next.t('toasts.pending'),
    options: {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    } as const,
  };

  static async withToast<T, M extends Record<string, unknown>>(
    promise: Promise<SuccessResponse<T, M> | ApiError>,
    config: Partial<ToastConfig> = {},
  ): Promise<SuccessResponse<T, M> | ApiError> {
    const mergedConfig = { ...this.DEFAULT_CONFIG, ...config };

    try {
      const result = await promise;

      if (isApiError(result)) {
        const errorMessage = result.error || mergedConfig.error;
        toast.error(errorMessage as ToastContent, mergedConfig.options);
        return result;
      }

      toast.success(mergedConfig.success as ToastContent, mergedConfig.options);
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : mergedConfig.error || 'Unknown error';

      toast.error(errorMessage as ToastContent, mergedConfig.options);

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  static success(message: string, options?: ToastOptions): void {
    toast.success(message, { ...this.DEFAULT_CONFIG.options, ...options });
  }

  static error(message: string, options?: ToastOptions): void {
    toast.error(message, { ...this.DEFAULT_CONFIG.options, ...options });
  }

  static info(message: string, options?: ToastOptions): void {
    toast.info(message, { ...this.DEFAULT_CONFIG.options, ...options });
  }

  static warning(message: string, options?: ToastOptions): void {
    toast.warning(message, { ...this.DEFAULT_CONFIG.options, ...options });
  }
}
