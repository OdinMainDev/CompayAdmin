
import { apiClient } from '../client';
import type { ApiError } from '../types/core';
import type { RequestOptions } from '../types/request';
import type { FilterReponse, GetUserListFiltersResponse, MerchantsSearchResponse, UserCreateRequest, UserListRequest, UserResponse, UsersListResponse, UserUpdateRequest } from '../types/user';

export class UserService {
  private static readonly BASE_PATH = '/api/panel/admin/dev/users';
  private static readonly MERCHANTS_PATH = '/api/panel/admin/dev/merchants';

  static async getList(
    params: UserListRequest = {},
    options?: RequestOptions
  ): Promise<UsersListResponse | ApiError> {
    try {
      return await apiClient.post<UsersListResponse['data']>(
        `${this.BASE_PATH}/list`,
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
        message: 'Failed to fetch users',
        error: error instanceof Error ? error.message : 'Unknown error'
      } as ApiError;
    }
  }

  static async getFilters(
    options?: RequestOptions
  ): Promise<GetUserListFiltersResponse | ApiError> {
    try {
      return await apiClient.get<FilterReponse[]>(
        `${this.BASE_PATH}/filters`,
        {
          ...options,
          isAuth: true,
          hasToast: options?.hasToast ?? false,
        }
      );
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch filters',
        error: error instanceof Error ? error.message : 'Unknown error'
      } as ApiError;
    }
  }

  static async getById(
    id: number,
    options?: RequestOptions
  ): Promise<UserResponse | ApiError> {
    try {
      return await apiClient.post<UserResponse['data']>(
        `${this.BASE_PATH}/get/${id}`, 
        {  }, 
        {
          ...options,
          isAuth: true,
          hasToast: options?.hasToast ?? false,
        }
      );
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch user',
        error: error instanceof Error ? error.message : 'Unknown error'
      } as ApiError;
    }
  }

  static async create(
    data: UserCreateRequest,
    options?: RequestOptions
  ): Promise<UserResponse | ApiError> {
    try {
      return await apiClient.post<UserResponse['data']>(
        `${this.BASE_PATH}/create`,
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
        message: 'Failed to create user',
        error: error instanceof Error ? error.message : 'Unknown error'
      } as ApiError;
    }
  }

  static async update(
    data: UserUpdateRequest,
    options?: RequestOptions
  ): Promise<UserResponse | ApiError> {
    try {
      return await apiClient.post<UserResponse['data']>(
        `${this.BASE_PATH}/process`,
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
        message: 'Failed to update user',
        error: error instanceof Error ? error.message : 'Unknown error'
      } as ApiError;
    }
  }

  static async delete(
    id: number,
    options?: RequestOptions
  ): Promise<{ success: boolean; message?: string } | ApiError> {
    try {
      return await apiClient.post<null>(
        `${this.BASE_PATH}/delete`,
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
        message: 'Failed to delete user',
        error: error instanceof Error ? error.message : 'Unknown error'
      } as ApiError;
    }
  }

  static async searchMerchants(
    query: string = '',
    options?: RequestOptions
  ): Promise<MerchantsSearchResponse | ApiError> {
    try {
      return await apiClient.post<MerchantsSearchResponse['data']>(
        `${this.MERCHANTS_PATH}/search`,
        {
          ...options,
          params: { q: query },
          isAuth: true,
          hasToast: options?.hasToast ?? false,
        }
      );
    } catch (error) {
      return {
        success: false,
        message: 'Failed to search merchants',
        error: error instanceof Error ? error.message : 'Unknown error'
      } as ApiError;
    }
  }

}