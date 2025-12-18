import i18next from 'i18next';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { COOKIE_AUTH_NAME, COOKIE_AUTH_TOTP_NAME } from '../constants';

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
    const token = Cookies.get(COOKIE_AUTH_NAME);
    if (token) {
      headers.Authorization = `Bearer ${token}`;
      const totp = Cookies.get(COOKIE_AUTH_TOTP_NAME);
      if (totp) {
        headers['X-Totp-Token'] = totp;
      }
    }
  }

  return headers;
};

const isApiError = (val: unknown): val is ApiError => {
  if (!val || typeof val !== 'object') return false;
  const candidate = val as Partial<ApiError>;
  return candidate.success === false || typeof candidate.error === 'string' || candidate.errors !== undefined;
};

const redirectTo = (path: string) => {
  if (typeof window !== 'undefined') {
    window.location.href = path;
  }
};

const handleAuthIssues = (status: number, data?: ApiError | null) => {
  if (status === 401) {
    Cookies.remove(COOKIE_AUTH_NAME);
    Cookies.remove(COOKIE_AUTH_TOTP_NAME);
    redirectTo('/');
    return true;
  }
  if (data?.error === 'AuthTotpExpired') {
    redirectTo('/auth/totp');
    return true;
  }
  return false;
};

const handleResponse = async <T>(response: Response): Promise<T | ApiError> => {
  const parsed = (await response.json().catch(() => null)) as (T & Partial<ApiError>) | ApiError | null;

  if (!response.ok) {
    const data = parsed ?? { success: false, error: 'Request failed', errors: {} };
    handleAuthIssues(response.status, isApiError(data) ? data : null);
    return data as ApiError;
  }

  if (parsed && isApiError(parsed) && handleAuthIssues(response.status, parsed)) {
    return parsed;
  }

  return (parsed as T) ?? ({} as T);
};

const withToast = async <T>(promise: Promise<T | ApiError>, hasToast?: boolean) => {
  if (!hasToast) return promise;

  const wrapped = promise.then((res) => (isApiError(res) ? Promise.reject(res) : res));

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
