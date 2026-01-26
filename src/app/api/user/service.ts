
import { FilterReponse } from '@/features/api-client/types/datatable';
import type { GetListFiltersResponse, UserCreateRequest, UserResponse, UserSearchResponse, UserUpdateRequest } from './types';
import { RequestOptions } from '@/features/api-client/types/request';
import { ApiError } from '@/features/api-client/types/core';
import { apiClient } from '@/features/api-client/client';
import { makeError } from '@/features/api-client/types/utils';
import { IResponseList } from '@/features/datatable-core';
import { User } from '@/app/entities/user';
import { IRequestOptions } from '@/features/datatable-core/domain/entities/DatatableRequest';

export class UserService {
  private static readonly ENDPOINTS = {
    LIST: "/api/panel/admin/dev/users/list",
    FILTERS: "/api/panel/admin/dev/users/list/filters",
    GET: "/api/panel/admin/dev/users/get",
    CREATE: "/api/panel/admin/dev/users/create",
    UPDATE: "/api/panel/admin/dev/users/process",
    DELETE: "/api/panel/admin/dev/users/delete",
    SEARCH: "/api/panel/admin/dev/users/search",
  } as const;

  static async getList(
    params: IRequestOptions = {},
    options?: RequestOptions
  ): Promise<IResponseList<User> | ApiError> {
    try {
      return await apiClient.post<IResponseList<User>["data"]>(
        `${UserService.ENDPOINTS.LIST}`,
        params,
        {
          ...options,
          isAuth: true,
          hasToast: options?.hasToast ?? false,
        }
      );
    } catch (error) {
      return makeError("Failed to fetch users", error);
    }
  }

  static async getFilters(
    options?: RequestOptions
  ): Promise<GetListFiltersResponse | ApiError> {
    try {
      return await apiClient.post<FilterReponse[]>(`${UserService.ENDPOINTS.FILTERS}`, {
        ...options,
        isAuth: true,
        hasToast: options?.hasToast ?? false,
      });
    } catch (error) {
      return makeError("Failed to fetch filters", error);
    }
  }

  static async getById(
    id: number,
    options?: RequestOptions
  ): Promise<UserResponse | ApiError> {
    try {
      return await apiClient.post<UserResponse["data"]>(
        `${this.ENDPOINTS.GET}/${id}`,
        {},
        {
          ...options,
          isAuth: true,
          hasToast: options?.hasToast ?? false,
        }
      );
    } catch (error) {
      return makeError("Failed to fetch user", error);
    }
  }

  static async create(
    data: UserCreateRequest,
    options?: RequestOptions
  ): Promise<UserResponse | ApiError> {
    try {
      return await apiClient.post<UserResponse["data"]>(
        `${this.ENDPOINTS.CREATE}`,
        data,
        {
          ...options,
          isAuth: true,
          hasToast: options?.hasToast ?? true,
        }
      );
    } catch (error) {
      return makeError("Failed to create user", error);
    }
  }

  static async update(
    data: UserUpdateRequest,
    options?: RequestOptions
  ): Promise<UserResponse | ApiError> {
    try {
      return await apiClient.post<UserResponse["data"]>(
        `${this.ENDPOINTS.UPDATE}`,
        data,
        {
          ...options,
          isAuth: true,
          hasToast: options?.hasToast ?? true,
        }
      );
    } catch (error) {
      return makeError("Failed to update user", error);
    }
  }

  static async delete(
    id: number,
    options?: RequestOptions
  ): Promise<{ success: boolean; message?: string } | ApiError> {
    try {
      return await apiClient.post<null>(
        `${UserService.ENDPOINTS.DELETE}`,
        { id },
        {
          ...options,
          isAuth: true,
          hasToast: options?.hasToast ?? true,
        }
      );
    } catch (error) {
      return makeError("Failed to delete user", error);
    }
  }
  
  static async search(
    query: string = "",
    options?: RequestOptions
  ): Promise<UserSearchResponse | ApiError> {
    try {
      return await apiClient.post<UserSearchResponse["data"]>(
        `${this.ENDPOINTS.SEARCH}`,
        {
          ...options,
          params: { q: query },
          isAuth: true,
          hasToast: options?.hasToast ?? false,
        }
      );
    } catch (error) {
      return makeError("Failed to search users", error);
    }
  }
}