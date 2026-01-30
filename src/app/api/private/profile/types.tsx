import { User } from '@/app/entities/user';

export interface ProfileResponse {
  readonly success: boolean;
  readonly data: User;
}

export interface ProfileRequest {
  old_username: string;
  new_username: string;
  old_password: string;
  new_password: string;
}

export interface Profile2FAResponse {
  readonly success: boolean;
  readonly data: string;
}

export interface Profile2FAActivateRequest {
  code: string;
}

export interface Profile2FAActivateResponse {
  readonly success: boolean;
}
