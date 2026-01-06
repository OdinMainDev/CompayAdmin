import type { ApiError, SuccessResponse, TypeGuard } from './core';

export const isApiError = <E extends string = string>(val: unknown): val is ApiError<E> => {
  if (!val || typeof val !== 'object') return false;
  
  const candidate = val as Record<string, unknown>;
  return (
    candidate.success === false || 
    typeof candidate.error === 'string'
  );
};

export const isSuccessResponse = <T, M extends Record<string, unknown>>(
  val: unknown
): val is SuccessResponse<T, M> => {
  if (!val || typeof val !== 'object') return false;
  
  const candidate = val as Record<string, unknown>;
  return candidate.success !== false && 'data' in candidate;
};

export const createTypeGuard = <T>(
  validate: (value: unknown) => boolean
): TypeGuard<T> => {
  return (value: unknown): value is T => validate(value);
};

export const isArrayOf = <T>(
  guard: TypeGuard<T>
): TypeGuard<ReadonlyArray<T>> => {
  return (value: unknown): value is ReadonlyArray<T> => {
    return Array.isArray(value) && value.every(guard);
  };
};

export const isObjectWith = <T extends Record<string, TypeGuard<unknown>>>(
  guards: T
): TypeGuard<{
  [K in keyof T]: T[K] extends TypeGuard<infer U> ? U : never
}> => {
  return (value: unknown): value is {
    [K in keyof T]: T[K] extends TypeGuard<infer U> ? U : never
  } => {
    if (!value || typeof value !== 'object') return false;
    
    const obj = value as Record<string, unknown>;
    return Object.entries(guards).every(([key, guard]) => {
      return guard(obj[key]);
    });
  };
};

export const transformResponse = <Input, Output>(
  guard: TypeGuard<Input>,
  transformer: (data: Input) => Output
): TypeGuard<Output> => {
  return (value: unknown): value is Output => {
    return guard(transformer(value as Input));
  };
};