import type { 
    AuthError, 
    AuthErrorType, 
    LoginResponseData,
    LegacyLoginResponseData,
    LoginResponseDataV2,
    AuthUser 
  } from './auth';
  import { isApiError } from './utils';
  
  export const isLegacyResponse = (data: LoginResponseData): data is LegacyLoginResponseData => {
    return 'success' in data;
  };
  
  export const isV2Response = (data: LoginResponseData): data is LoginResponseDataV2 => {
    return 'token' in data && typeof data.token === 'string' && 'user' in data;
  };
  
  export const getTokenFromResponse = (data: LoginResponseData): string | null => {
    if (isLegacyResponse(data)) {
      return data.token || null;
    }
    return data.token;
  };
  
  export const getUserFromResponse = (data: LoginResponseData): AuthUser | null => {
    if (isLegacyResponse(data)) {
      return data.user || null;
    }
    return data.user;
  };
  
  export const mapToAuthError = (error: unknown): AuthError => {
    if (isAuthError(error)) {
      return error;
    }
  
    if (isApiError<string>(error)) {
      const errorMapping: Readonly<Record<string, AuthErrorType>> = {
        'Invalid credentials': 'INVALID_CREDENTIALS',
        'Invalid email or password': 'INVALID_CREDENTIALS',
        'Account is locked': 'ACCOUNT_LOCKED',
        'TOTP required': 'TOTP_REQUIRED',
        'Invalid TOTP code': 'TOTP_INVALID',
        'TOTP expired': 'TOTP_EXPIRED',
        'Token expired': 'TOKEN_EXPIRED',
        'Unauthorized': 'UNAUTHORIZED',
        'AuthTotpExpired': 'TOTP_EXPIRED',
        'Not authenticated': 'UNAUTHORIZED',
        'Network error': 'NETWORK_ERROR',
      };
  
      const authErrorType = errorMapping[error.error] || 'UNAUTHORIZED';
      
      return {
        success: false,
        error: authErrorType,
        errors: error.errors,
      };
    }
  
    return {
      success: false,
      error: 'UNAUTHORIZED',
      errors: {
        general: error instanceof Error ? error.message : 'Unknown authentication error',
      },
    };
  };
  
  export const isAuthError = (val: unknown): val is AuthError => {
    if (!isApiError<string>(val)) return false;
    
    const authErrorTypes: ReadonlyArray<AuthErrorType> = [
      'INVALID_CREDENTIALS',
      'ACCOUNT_LOCKED',
      'TOTP_REQUIRED',
      'TOTP_INVALID',
      'TOTP_EXPIRED',
      'TOKEN_EXPIRED',
      'UNAUTHORIZED',
      'NETWORK_ERROR',
    ];
    
    return authErrorTypes.includes(val.error as AuthErrorType);
  };
  
  export const decodeJwtToken = (token: string): { user_id?: number; username?: string; is_admin?: boolean; merchant_id?: number } | null => {
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;
      
      const decoded = JSON.parse(atob(payload));
      return {
        user_id: decoded.user_id,
        username: decoded.username,
        is_admin: decoded.is_admin,
        merchant_id: decoded.merchant_id,
      };
    } catch {
      return null;
    }
  };