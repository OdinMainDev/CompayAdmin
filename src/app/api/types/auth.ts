import type { ApiError, SuccessResponse } from './core';

export type LoginRequest = {
  email: string;
  password: string;
};

export interface TotpRequest {
  readonly code: string;
}

export interface LegacyLoginResponseData {
  readonly success: boolean;
  readonly token?: string;
  readonly error?: string;
  readonly errors?: Record<string, string>;
  readonly user?: {
    readonly id: number;
    readonly username: string;
    readonly is_admin: boolean;
    readonly merchant_id: number | null;
  };
}

export type LoginResponse = {
  readonly success: boolean;
  readonly token: string;
};

export interface TotpResponseData {
  readonly token: string;
  readonly requires_password_change?: boolean;
}
export type TotpResponse = SuccessResponse<TotpResponseData>;

export interface LogoutResponseData {
  readonly message: string;
}
export type LogoutResponse = SuccessResponse<LogoutResponseData>;


export type AuthError = ApiError;

export interface AuthUser {
  readonly id: number;
  readonly username: string;
  readonly is_admin: boolean;
  readonly merchant_id: number | null;
}

export type UserRole = 'admin' | 'merchant';