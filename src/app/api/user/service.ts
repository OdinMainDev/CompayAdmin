
import { FilterReponse } from '@/features/api-client/types/datatable';
import type { GetUserListFiltersResponse, UserCreateRequest, UserListRequest, UserResponse, UsersListResponse, UserUpdateRequest } from './types';
import { RequestOptions } from '@/features/api-client/types/request';
import { ApiError } from '@/features/api-client/types/core';
import { apiClient } from '@/features/api-client/client';

export class UserService {
  private static readonly ENDPOINTS = {
    LIST: "/api/panel/admin/dev/users/list",
    FILTERS: "/api/panel/admin/dev/users/list/filters",
    GET: "/api/panel/admin/dev/users/get",
    CREATE: "/api/panel/admin/dev/users/create",
    UPDATE: "/api/panel/admin/dev/users/update",
    DELETE: "/api/panel/admin/dev/users/delete",
  } as const;

  static async getList(
    params: UserListRequest = {},
    options?: RequestOptions
  ): Promise<UsersListResponse | ApiError> {
    try {
      return await apiClient.post<UsersListResponse["data"]>(
        `${this.ENDPOINTS.LIST}`,
        params,
        {
          ...options,
          isAuth: true,
          hasToast: options?.hasToast ?? false,
        }
      );
    } catch (error) {
      return {
        success: false,
        message: "Failed to fetch users",
        error: error instanceof Error ? error.message : "Unknown error",
      } as ApiError;
    }
  }

  static async getFilters(
    options?: RequestOptions
  ): Promise<GetUserListFiltersResponse | ApiError> {
    try {
      return await apiClient.post<FilterReponse[]>(`${this.ENDPOINTS.FILTERS}`, {
        ...options,
        isAuth: true,
        hasToast: options?.hasToast ?? false,
      });
    } catch (error) {
      return {
        success: false,
        message: "Failed to fetch filters",
        error: error instanceof Error ? error.message : "Unknown error",
      } as ApiError;
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
      return {
        success: false,
        message: "Failed to fetch user",
        error: error instanceof Error ? error.message : "Unknown error",
      } as ApiError;
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
      return {
        success: false,
        message: "Failed to create user",
        error: error instanceof Error ? error.message : "Unknown error",
      } as ApiError;
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
      return {
        success: false,
        message: "Failed to update user",
        error: error instanceof Error ? error.message : "Unknown error",
      } as ApiError;
    }
  }

  static async delete(
    id: number,
    options?: RequestOptions
  ): Promise<{ success: boolean; message?: string } | ApiError> {
    try {
      return await apiClient.post<null>(
        `${this.ENDPOINTS.DELETE}`,
        { id },
        {
          ...options,
          isAuth: true,
          hasToast: options?.hasToast ?? true,
        }
      );
    } catch (error) {
      return {
        success: false,
        message: "Failed to delete user",
        error: error instanceof Error ? error.message : "Unknown error",
      } as ApiError;
    }
  }
}