export interface ApiError {
  readonly success: false;
  readonly error?: string;
  readonly errors?: Record<string, string[]>;
  readonly message?: string;
}

export interface SuccessResponse<T, M extends Record<string, unknown> = Record<string, never>> {
  readonly success: true;
  readonly data: T;
  readonly meta?: M;
}

export type ApiResponse<T, M extends Record<string, unknown> = Record<string, never>> =
  | SuccessResponse<T, M>
  | ApiError;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type DataTransformer<Input, Output> = (data: Input) => Output;

export type Validator<T> = (data: T) => string | null;
