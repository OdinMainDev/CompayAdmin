import type { HttpMethod } from './core';

export type RequestOptions<B = unknown> = {
  method?: HttpMethod;
  isAuth?: boolean;
  body?: B;
  hasToast?: boolean;
  withFingerprint?: boolean;
  headers?: Record<string, string>;
  timeout?: number;
  params?: Record<string, string | number | boolean | null | undefined>;
  signal?: AbortSignal;
};

export interface RequestConfig<B = never> extends Omit<RequestOptions<B>, 'signal'> {
  readonly url: string;
}

export interface PaginatedResponse<T, M extends Record<string, unknown> = Record<string, never>> {
  readonly data: ReadonlyArray<T>;
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly hasMore: boolean;
  readonly meta?: M;
}

export interface PaginationParams {
  readonly page?: number;
  readonly limit?: number;
  readonly sortBy?: string;
  readonly sortOrder?: 'asc' | 'desc';
}

export type FilterValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ReadonlyArray<string | number>;
export interface FilterParams {
  readonly [key: string]: FilterValue | FilterParams;
}
