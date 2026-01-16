import Cookies from 'js-cookie';
import { apiClient } from '../core/client';
import { COOKIE_AUTH_NAME, COOKIE_AUTH_TOTP_NAME } from '../../../constants';
import type { 
  LoginRequest, 
  LoginResponse, 
  LogoutResponse,
  AuthError,
  UserRole 
} from './types';
import type { RequestOptions } from '../core/types/request';
import type { ApiError } from '../core/types/core';
import type { User, UserResponse } from '../users/types';

export class AuthService {
  private static readonly ENDPOINTS = {
    LOGIN: "/api/auth/login",
    TOTP: "/api/panel/auth/totp",
    LOGOUT: "/api/panel/auth/logout",
    VERIFY: "/api/panel/auth/verify",
    ME: "/api/panel/get/me",
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
  static async getMe(
    options: Omit<RequestOptions, "method" | "body"> = {}
  ): Promise<UserResponse | ApiError> {
    try {
      return await apiClient.post<UserResponse["data"]>(
        this.ENDPOINTS.ME,
        {},
        {
          ...options,
          isAuth: true,
          hasToast: options.hasToast ?? false,
        }
      );
    } catch (error) {
      return {
        success: false,
        message: "Failed to fetch current user",
        error: error instanceof Error ? error.message : "Unknown error",
      } as ApiError;
    }
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
    options: Omit<RequestOptions<LoginRequest>, "method" | "body"> = {}
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
        message: "Login failed",
        error: error instanceof Error ? error.message : "Unknown error",
      } as ApiError;
    }
  }

  static async logout(
    options: Omit<RequestOptions, "method" | "body"> = {}
  ): Promise<LogoutResponse | AuthError> {
    try {
      const response = await apiClient.post<LogoutResponse["data"]>(
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
        message: "Logout error",
        error: error instanceof Error ? error.message : "Unknown error",
      } as ApiError;
    }
  }

  static async checkAuthStatus(): Promise<{
    isAuthenticated: boolean;
    user: User | null;
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

    const response = await this.getMe();

    if (!response.success) {
      return {
        isAuthenticated: false,
        user: null,
        error: null,
      };
    }

    return {
      isAuthenticated: true,
      user: response.data,
      error: null,
    };
  }
}