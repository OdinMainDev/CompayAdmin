export interface ApiError<T extends string = string> {
    readonly success: false;
    readonly error: T;
    readonly errors?: Readonly<Record<string, string | ReadonlyArray<string>>>;
  }
  
  export interface SuccessResponse<T, M extends Record<string, unknown> = Record<string, never>> {
    readonly success: true;
    readonly data: T;
    readonly meta?: M;
  }
  
  export type ApiResponse<T, M extends Record<string, unknown> = Record<string, never>, E extends string = string> = 
    | SuccessResponse<T, M>
    | ApiError<E>;
  
  export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  
  export type TypeGuard<T> = (value: unknown) => value is T;
  
  export type DataTransformer<Input, Output> = (data: Input) => Output;
  
  export type Validator<T> = (data: T) => string | null;