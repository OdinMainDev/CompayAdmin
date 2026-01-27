import type { ApiError, SuccessResponse } from './core';

export const isSuccessResponse = <T, M extends Record<string, unknown>>(
  val: unknown,
): val is SuccessResponse<T, M> => {
  if (!val || typeof val !== 'object') return false;

  const candidate = val as Record<string, unknown>;
  return candidate.success !== false && 'data' in candidate;
};

export const makeError = (message: string, error: unknown): ApiError => ({
  success: false,
  message,
  error: error instanceof Error ? error.message : 'Unknown error',
});
