import { apiClient } from '@/features/api-client/client';
import type { 
  ProfileResponse, 
} from './types';
import { RequestOptions } from '@/features/api-client/types/request';
import { ApiError } from '@/features/api-client/types/core';

export class ProfileService {
  private static readonly ENDPOINTS = {
    ME: "/api/panel/get/me",
  } as const;

 static async getMe(
    options: Omit<RequestOptions, "method" | "body"> = {}
  ): Promise<ProfileResponse | ApiError> {
    try {
      return await apiClient.post<ProfileResponse["data"]>(
        this.ENDPOINTS.ME,
        {},
        {
          ...options,
          isAuth: true,
          hasToast: options.hasToast ?? false,
        }
      );
    } catch (error) {
      return {
        success: false,
        message: "Failed to fetch current user",
        error: error instanceof Error ? error.message : "Unknown error",
      } as ApiError;
    }
  }
}