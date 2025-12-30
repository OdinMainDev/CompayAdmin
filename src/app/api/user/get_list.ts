import type { EntityUser } from "../../entities/user";
import { getRequest, postRequest, type ApiError } from "../request";

export type FilterReponse = {
    name: string,
    type: string,
    values: number | string | string[] | number[]
}

export type GetUserListFiltersResponse = {
  success: boolean;
  data: FilterReponse[];
};

export interface UserRecord {
  id: number;
  username: string;
  created_at: string;
  updated_at: string;
  merchant_id: number;
  is_twofa_enabled: boolean;
  is_banned: boolean;
}

export interface GetUserListResponse {
  data: {
    data: UserRecord[],
    recordsTotal: number;
    recordsFiltered: number;
    recordsCount: number;
  };
  success: boolean;
}


export const getUserList = () => {
  return postRequest<GetUserListResponse | ApiError>(
    '/api/panel/admin/dev/users/list',
    {
      isAuth: true,
      body: {
        length: 10,
        order_column: 'id',
        order_direction: 'asc',
      },
    }
  );
};

  
export const getUserListFilters = () =>
  postRequest<GetUserListFiltersResponse | ApiError>('/api/panel/admin/dev/users/list/filters', { isAuth: true });
