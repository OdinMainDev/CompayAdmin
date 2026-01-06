import Cookies from 'js-cookie';
import { apiClient } from '../client';
import { ToastService } from '../toastService';
import { COOKIE_AUTH_NAME, COOKIE_AUTH_TOTP_NAME } from '../../../constants';
import { isApiError } from '../types/utils';
import { 
  mapToAuthError, 
  isLegacyResponse, 
  getTokenFromResponse, 
  getUserFromResponse,
  decodeJwtToken 
} from '../types/auth-utils';
import type { 
  LoginRequest, 
  LoginResponse, 
  TotpRequest, 
  TotpResponse,
  LogoutResponse,
  VerifyTokenResponse,
  AuthError,
  AuthUser,
  UserRole 
} from '../types/auth';
import type { RequestOptions } from '../types/request';

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
    const user = this.getUserFromToken();
    if (!user) return null;
    
    return user.is_admin ? 'admin' : 'user';
  }

  static async login(
    credentials: LoginRequest,
    options: Omit<RequestOptions<LoginRequest>, 'method' | 'body'> = {}
  ): Promise<LoginResponse | AuthError> {
    try {
      const response = await apiClient.post<LoginResponse['data'], never, LoginRequest>(
        this.ENDPOINTS.LOGIN,
        credentials,
        { 
          ...options, 
          isAuth: false,
          hasToast: options.hasToast ?? true,
        }
      );

      if (isApiError<string>(response)) {
        return mapToAuthError(response);
      }

      const data = response.data;
      const token = getTokenFromResponse(data);
      const user = getUserFromResponse(data);

      if (!token) {
        if (isLegacyResponse(data) && !data.success) {
          return mapToAuthError({ 
            success: false, 
            error: data.error || 'INVALID_CREDENTIALS',
            errors: data.errors 
          });
        }
        
        return mapToAuthError(new Error('No token received'));
      }

      this.saveToken(token);

      const normalizedData = {
        token,
        user: user || this.getUserFromToken() || {
          id: 0,
          username: '',
          is_admin: false,
          merchant_id: null,
        },
      };

      ToastService.success('Login successful');
      
      return {
        success: true,
        data: normalizedData,
      };

    } catch (error) {
      const authError = mapToAuthError(error);
      ToastService.error('Network error occurred');
      return authError;
    }
  }

  static async verifyTotp(
    code: string,
    options: Omit<RequestOptions<TotpRequest>, 'method' | 'body'> = {}
  ): Promise<TotpResponse | AuthError> {
    const request: TotpRequest = { code };

    try {
      const response = await apiClient.post<TotpResponse['data'], never, TotpRequest>(
        this.ENDPOINTS.TOTP,
        request,
        { 
          ...options, 
          isAuth: true,
          hasToast: options.hasToast ?? true,
        }
      );

      if (isApiError<string>(response)) {
        return mapToAuthError(response);
      }

      this.saveToken(response.data.token);

      return response;

    } catch (error) {
      return mapToAuthError(error);
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

      if (isApiError<string>(response)) {
        return mapToAuthError(response);
      }

      this.clearToken();

      ToastService.success('Logged out successfully');
      return response;

    } catch (error) {
      this.clearToken();
      return mapToAuthError(error);
    }
  }

  static async verifyToken(
    options: Omit<RequestOptions, 'method' | 'body'> = {}
  ): Promise<VerifyTokenResponse | AuthError> {
    try {
      const response = await apiClient.get<VerifyTokenResponse['data']>(
        this.ENDPOINTS.VERIFY,
        { 
          ...options, 
          isAuth: true,
          hasToast: options.hasToast ?? false,
        }
      );

      if (isApiError<string>(response)) {
        return mapToAuthError(response);
      }

      return response;

    } catch (error) {
      return mapToAuthError(error);
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

    const result = await this.verifyToken({ hasToast: false });

    if (isApiError(result)) {
      this.clearToken();
      return {
        isAuthenticated: false,
        user: null,
        error: result,
      };
    }

    return {
      isAuthenticated: true,
      user: result.data.user || this.getUserFromToken(),
      error: null,
    };
  }
}