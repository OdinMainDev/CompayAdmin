
import { FilterReponse } from '@/features/api-client/types/datatable';
import type { GetListFiltersResponse } from './types';
import { RequestOptions } from '@/features/api-client/types/request';
import { ApiError } from '@/features/api-client/types/core';
import { apiClient } from '@/features/api-client/client';
import { makeError } from '@/features/api-client/types/utils';
import { IResponseList } from '@/features/datatable-core';
import { Notification } from '@/app/entities/notification';
import { IRequestOptions } from '@/features/datatable-core/domain/entities/DatatableRequest';

export class NotificationService {
  private static readonly ENDPOINTS = {
    LIST: "/api/panel/notifications/list",
    FILTERS: "/api/panel/notifications/list/filters",
    GET_UNREAD: "/api/panel/notifications/get/unread",
    READ: "/api/panel/notifications/read",
    READ_ALL: "/api/panel/notifications/read/all",
  } as const;

  static async getList(
    params: IRequestOptions = {},
    options?: RequestOptions
  ): Promise<IResponseList<Notification> | ApiError> {
    try {
      return await apiClient.post<IResponseList<Notification>["data"]>(
        `${NotificationService.ENDPOINTS.LIST}`,
        params,
        {
          ...options,
          isAuth: true,
          hasToast: options?.hasToast ?? false,
        }
      );
    } catch (error) {
      return makeError("Failed to fetch notifications", error);
    }
  }

  static async getFilters(
    options?: RequestOptions
  ): Promise<GetListFiltersResponse | ApiError> {
    try {
      return await apiClient.post<FilterReponse[]>(`${NotificationService.ENDPOINTS.FILTERS}`, {
        ...options,
        isAuth: true,
        hasToast: options?.hasToast ?? false,
      });
    } catch (error) {
      return makeError("Failed to fetch filters", error);
    }
  }

  static async getUnread(
    options?: RequestOptions
  ): Promise<GetListFiltersResponse | ApiError> {
    try {
      return await apiClient.post<FilterReponse[]>(`${NotificationService.ENDPOINTS.GET_UNREAD}`, {
        ...options,
        isAuth: true,
        hasToast: options?.hasToast ?? false,
      });
    } catch (error) {
      return makeError("Failed to fetch unread notifications", error);
    }
  }

  static async read(
    id: number,
    options?: RequestOptions
  ): Promise<GetListFiltersResponse | ApiError> {
    try {
      return await apiClient.post<FilterReponse[]>(`${NotificationService.ENDPOINTS.READ}/${id}`, {
        ...options,
        isAuth: true,
        hasToast: options?.hasToast ?? false,
      });
    } catch (error) {
      return makeError("Failed to read notification", error);
    }
  }

  static async readAll(
    options?: RequestOptions
  ): Promise<GetListFiltersResponse | ApiError> {
    try {
      return await apiClient.post<FilterReponse[]>(`${NotificationService.ENDPOINTS.READ_ALL}`, {
        ...options,
        isAuth: true,
        hasToast: options?.hasToast ?? false,
      });
    } catch (error) {
      return makeError("Failed to read all notifications", error);
    }
  }
}