import { handleAuthError, redirectTo } from './config';
import { isApiError, isSuccessResponse } from './types/utils';
import type { ApiError, SuccessResponse } from './types/core';

export class ApiResponseError<T extends string = string> extends Error {
  constructor(
    public readonly error: ApiError<T>,
    public readonly status: number
  ) {
    super(error.error);
    this.name = 'ApiResponseError';
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor() {
    super('Request timeout');
    this.name = 'TimeoutError';
  }
}

export const handleResponse = async <T, M extends Record<string, unknown>>(
  response: Response
): Promise<SuccessResponse<T, M> | ApiError<string>> => {
  const text = await response.text();
  let parsed: unknown;
  
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = null;
  }

  if (!response.ok) {
    const errorData: ApiError<string> = isApiError(parsed) 
      ? parsed 
      : { 
          success: false, 
          error: `Request failed with status ${response.status}`,
          errors: {} 
        };
    
    const authError = handleAuthError(response.status, errorData.error);
    if (authError === 'UNAUTHORIZED') {
      redirectTo('/');
    } else if (authError === 'TOTP_EXPIRED') {
      redirectTo('/auth/totp');
    }
    
    return errorData;
  }

  if (isApiError(parsed)) {
    const authError = handleAuthError(response.status, parsed.error);
    if (authError) {
      return parsed;
    }
    return parsed;
  }

  const successResponse: SuccessResponse<T, M> = isSuccessResponse<T, M>(parsed)
    ? parsed
    : { success: true, data: parsed as T };

  return successResponse;
};