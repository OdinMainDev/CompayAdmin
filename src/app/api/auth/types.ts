import type { ApiError, SuccessResponse } from '../core/types/core';

export type LoginRequest = {
  email: string;
  password: string;
};

export interface TotpRequest {
  readonly code: string;
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

// export type Me = {
//   username: string;
//   merchant: Merchant;
// };

// export type GetMeResponse = {
//   success: boolean;
//   data: EntityUser;
// };

export type UserRole = 'admin' | 'merchant';