import i18next from 'i18next';
import { toast } from 'react-toastify';

type RequestOptions = {
  isAuth?: boolean;
  body?: Record<string, unknown> | null;
  hasToast?: boolean;
};

type ApiError = {
  success: false;
  error: string;
  errors?: Record<string, string | string[]>;
};

const baseUrl = import.meta.env.VITE_API_URL;

const buildHeaders = (isAuth?: boolean) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (isAuth) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

const isApiError = (val: unknown): val is ApiError => {
  if (!val || typeof val !== 'object') return false;
  const candidate = val as Partial<ApiError>;
  return candidate.success === false || typeof candidate.error === 'string' || candidate.errors !== undefined;
};

const handleResponse = async <T>(response: Response): Promise<T | ApiError> => {
  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as ApiError | null;
    return (
      data || {
        success: false,
        error: 'Request failed',
        errors: {},
      }
    );
  }
  return (await response.json()) as T;
};

const withToast = async <T>(promise: Promise<T | ApiError>, hasToast?: boolean) => {
  if (!hasToast) return promise;

  const wrapped = promise.then((res) => {
    if (isApiError(res)) {
      throw res;
    }
    return res;
  });

  return toast
    .promise(wrapped, {
      pending: i18next.t('toasts.pending'),
      success: i18next.t('toasts.success'),
      error: {
        render({ data }) {
            const err = data as ApiError | undefined;
            if (err?.error) return i18next.t('toasts.code') + err.error;
            return i18next.t('toasts.fail');
        },
      },
    })
    .catch((err: ApiError) => err);
};

export const postRequest = async <T>(
  url: string,
  options: RequestOptions = {},
): Promise<T | ApiError> => {
  const { isAuth, body, hasToast } = options;
  const response = fetch(`${baseUrl}${url}`, {
    method: 'POST',
    headers: buildHeaders(isAuth),
    body: body ? JSON.stringify(body) : null,
  }).then((res) => handleResponse<T>(res));
  return withToast<T | ApiError>(response, hasToast);
};

export const getRequest = async <T>(
  url: string,
  options: RequestOptions = {},
): Promise<T | ApiError> => {
  const { isAuth, hasToast } = options;
  const response = fetch(`${baseUrl}${url}`, {
    method: 'GET',
    headers: buildHeaders(isAuth),
  }).then((res) => handleResponse<T>(res));
  return withToast<T | ApiError>(response, hasToast);
};

export type { ApiError };
