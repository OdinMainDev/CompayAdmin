import Cookies from 'js-cookie';
import { apiClient } from '../client';
import { COOKIE_AUTH_NAME, COOKIE_AUTH_TOTP_NAME } from '../../../constants';
import { 
  decodeJwtToken 
} from '../types/auth-utils';
import type { 
  LoginRequest, 
  LoginResponse, 
  LogoutResponse,
  AuthError,
  AuthUser,
  UserRole 
} from '../types/auth';
import type { RequestOptions } from '../types/request';
import type { ApiError } from '../types/core';

export class AuthService {
  private static readonly ENDPOINTS = {
    LOGIN: '/api/auth/login',
    TOTP: '/api/panel/auth/totp',
    LOGOUT: '/api/panel/auth/logout',
    VERIFY: '/api/panel/auth/verify',
  } as const;

  static saveToken(token: string): void {
    Cookies.set(COOKIE_AUTH_NAME, token);
  }

  static saveTotpToken(token: string): void {
    Cookies.set(COOKIE_AUTH_TOTP_NAME, token);
  }

  static clearToken(): void {
    Cookies.remove(COOKIE_AUTH_NAME);
    Cookies.remove(COOKIE_AUTH_TOTP_NAME);
  }

  static getToken(): string | null {
    return Cookies.get(COOKIE_AUTH_NAME) || null;
  }

  static getTotpToken(): string | null {
    return Cookies.get(COOKIE_AUTH_TOTP_NAME) || null;
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static getUserFromToken(): AuthUser | null {
    const token = this.getToken();
    if (!token) return null;

    const decoded = decodeJwtToken(token);
    if (!decoded || !decoded.user_id) return null;

    return {
      id: decoded.user_id,
      username: decoded.username || '',
      is_admin: decoded.is_admin || false,
      merchant_id: decoded.merchant_id || null,
    };
  }

  static getRoleFromToken(): UserRole | null {
    try {
      const payload = this.getToken()?.split(".")?.[1];
      if (!payload) return "merchant";
      const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
      const padded = normalized.padEnd(
        normalized.length + ((4 - (normalized.length % 4)) % 4),
        "="
      );
      const decoded = JSON.parse(atob(padded));
      return decoded?.isa === true ? "admin" : "merchant";
    } catch {
      return "merchant";
    }
  }

  static async login(
    credentials: LoginRequest,
    options: Omit<RequestOptions<LoginRequest>, 'method' | 'body'> = {}
  ): Promise<LoginResponse | ApiError> {
    try {
      const response = await apiClient.post<LoginResponse>(
        this.ENDPOINTS.LOGIN,
        credentials,
        { 
          ...options, 
          isAuth: false,
          hasToast: options.hasToast ?? true,
        }
      );

      if (!response.success) {
        return response;
      }

      const token = response.data.token;
      this.saveToken(token);

      return response.data;
    } catch (error) {
      return {
        success: false,
        message: 'Login failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      } as ApiError;
    }
  }

  static async logout(
    options: Omit<RequestOptions, 'method' | 'body'> = {}
  ): Promise<LogoutResponse | AuthError> {
    try {
      const response = await apiClient.post<LogoutResponse['data']>(
        this.ENDPOINTS.LOGOUT,
        { 
          ...options, 
          isAuth: true,
          hasToast: options.hasToast ?? true,
        }
      );

      this.clearToken();
      return response;
    } catch (error) {
      this.clearToken();
      return {
        success: false,
        message: 'Logout error',
        error: error instanceof Error ? error.message : 'Unknown error'
      } as ApiError;
    }
  }


  static async checkAuthStatus(): Promise<{
    isAuthenticated: boolean;
    user: AuthUser | null;
    error: AuthError | null;
  }> {
    if (!this.isAuthenticated()) {
      return {
        isAuthenticated: false,
        user: null,
        error: null,
      };
    }

    // verify if needed
    return {
      isAuthenticated: true,
      user: this.getUserFromToken(),
      error: null,
    };
  }
}