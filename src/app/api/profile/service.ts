import { apiClient } from '@/features/api-client/client';
import type { 
  ProfileResponse, 
} from './types';
import { RequestOptions } from '@/features/api-client/types/request';
import { ApiError } from '@/features/api-client/types/core';
import { makeError } from '@/features/api-client/types/utils';

export class ProfileService {
  private static readonly ENDPOINTS = {
    GET: "/api/panel/profile/get",
  } as const;

 static async get(
    options: Omit<RequestOptions, "method" | "body"> = {}
  ): Promise<ProfileResponse | ApiError> {
    try {
      return await apiClient.post<ProfileResponse["data"]>(
        this.ENDPOINTS.GET,
        {},
        {
          ...options,
          isAuth: true,
          hasToast: options.hasToast ?? false,
        }
      );
    } catch (error) {
      return makeError("Failed to fetch current profile", error);
    }
  }
}