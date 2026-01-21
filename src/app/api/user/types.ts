import { User } from "@/app/entities/user";
import { FilterReponse } from "@/features/api-client/types/datatable";

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

export type GetUserListFiltersResponse = {
  success: boolean;
  data: FilterReponse[];
};
