import { User } from "@/app/entities/user";

export interface ProfileResponse {
  readonly success: boolean;
  readonly data: User;
}