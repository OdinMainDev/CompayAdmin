export interface Merchant {
  readonly id: number;
  readonly created_at: number;
  readonly updated_at: number;
  readonly name: string;
  readonly token: string;
  readonly is_enabled: boolean;
  readonly settings: {
    blocked_countries: string[] | null;
    allowed_countries: string[] | null;
  };
}

export interface User {
  readonly id: number;
  readonly username: string;
  readonly is_banned: boolean;
  readonly is_admin: boolean;
  readonly merchant_id: number | null;
  readonly is_twofa_enabled: boolean;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface UserListRequest {
  length?: number;
  start?: number;
  order_column?: string;
  order_direction?: string;
  filters?: Record<string, unknown>
}

export interface UserCreateRequest {
  username: string;
  password: string;
  is_admin: boolean;
  merchant_id?: number;
}

export interface UserUpdateRequest {
  id: number;
  username?: string;
  password?: string;
  is_banned?: boolean;
  do_disable_twofa?: boolean;
}

export interface UserResponse {
  readonly success: boolean;
  readonly data: User;
}

export interface UsersListResponse {
  readonly success: boolean;
  readonly data: {
    readonly data: User[];
    readonly total: number;
    readonly per_page: number;
    readonly current_page: number;
    readonly draw?: number;
    readonly recordsTotal?: number;
    readonly recordsFiltered?: number;
  };
}


export interface MerchantsSearchResponse {
  readonly success: boolean;
  readonly data: Merchant[];
}

export type FilterReponse = {
  name: string;
  type: string;
  values: number | string | string[] | number[];
};

export type GetUserListFiltersResponse = {
  success: boolean;
  data: FilterReponse[];
};
