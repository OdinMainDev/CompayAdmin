import type { ApiError, SuccessResponse } from './core';

export interface LoginRequest {
  readonly email: string;
  readonly password: string;
}

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

export interface LoginResponseDataV2 {
  readonly token: string;
  readonly user: {
    readonly id: number;
    readonly username: string;
    readonly is_admin: boolean;
    readonly merchant_id: number | null;
  };
}

export type LoginResponseData = LegacyLoginResponseData | LoginResponseDataV2;
export type LoginResponse = SuccessResponse<LoginResponseData>;

export interface TotpResponseData {
  readonly token: string;
  readonly requires_password_change?: boolean;
}
export type TotpResponse = SuccessResponse<TotpResponseData>;

export interface LogoutResponseData {
  readonly message: string;
}
export type LogoutResponse = SuccessResponse<LogoutResponseData>;

export interface VerifyTokenResponseData {
  readonly valid: boolean;
  readonly user?: LoginResponseDataV2['user'];
}
export type VerifyTokenResponse = SuccessResponse<VerifyTokenResponseData>;

export type AuthErrorType = 
  | 'INVALID_CREDENTIALS'
  | 'ACCOUNT_LOCKED'
  | 'TOTP_REQUIRED'
  | 'TOTP_INVALID'
  | 'TOTP_EXPIRED'
  | 'TOKEN_EXPIRED'
  | 'UNAUTHORIZED'
  | 'NETWORK_ERROR';

export type AuthError = ApiError<AuthErrorType>;

export interface AuthUser {
  readonly id: number;
  readonly username: string;
  readonly is_admin: boolean;
  readonly merchant_id: number | null;
}

export type UserRole = 'admin' | 'user';