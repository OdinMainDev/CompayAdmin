import { User } from "@/app/entities/user";
import { FilterReponse } from "@/features/api-client/types/datatable";

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
}

export interface UserResponse {
  readonly success: boolean;
  readonly data: User;
}

export type GetListFiltersResponse = {
  readonly success: boolean;
  readonly data: FilterReponse[];
};

export interface UserSearchResponse {
  readonly success: boolean;
  readonly data: User[];
}