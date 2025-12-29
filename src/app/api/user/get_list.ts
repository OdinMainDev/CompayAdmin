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
export type GetUserListResponse = {
    id: number,
    username: string
}

export const getUserList = () => {
  return postRequest<GetUserListResponse | ApiError>(
    '/api/panel/admin/dev/users/list',
    {
      isAuth: true,
      body: {
        Length: 10,
        OrderColumn: 'id',
        OrderDirection: 'asc',
      },
    }
  );
};

  
export const getUserListFilters = () =>
  postRequest<GetUserListFiltersResponse | ApiError>('/api/panel/admin/dev/users/list/filters', { isAuth: true });
