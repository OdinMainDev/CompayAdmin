import type { EntityUser } from "../../entities/user";
import { getRequest, type ApiError } from "../request";

export type GetMeResponse = {
  success: boolean;
  data: EntityUser;
};

export const getMe = () =>
  getRequest<GetMeResponse | ApiError>('/api/panel/get/me', { isAuth: true });
