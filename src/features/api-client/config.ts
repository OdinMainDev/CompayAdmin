import Cookies from 'js-cookie';
import { COOKIE_AUTH_NAME, COOKIE_AUTH_TOTP_NAME } from '@/constants';

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL as string,
  TIMEOUT: 30000,
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  } as const,
} as const;

export type AuthErrorType = 'UNAUTHORIZED' | 'TOTP_EXPIRED';

export const handleAuthError = (status: number, error?: string): AuthErrorType | null => {
  if (status === 401) {
    Cookies.remove(COOKIE_AUTH_NAME);
    Cookies.remove(COOKIE_AUTH_TOTP_NAME);
    return 'UNAUTHORIZED';
  }
  
  if (error === 'AuthTotpExpired') {
    return 'TOTP_EXPIRED';
  }
  
  return null;
};

export const buildHeaders = (
  isAuth: boolean = true,
  customHeaders: Readonly<Record<string, string>> = {}
): HeadersInit => {
  const headers: Record<string, string> = {
    ...API_CONFIG.DEFAULT_HEADERS,
    ...customHeaders,
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

export const redirectTo = (path: string): void => {
  if (typeof window !== 'undefined') {
    window.location.href = path;
  }
};