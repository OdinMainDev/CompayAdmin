import type { EntityUser } from "../../entities/user";
import { postRequest, type ApiError } from "../request";

export type GetMeResponse = EntityUser;

export const getMe = () =>
  postRequest<GetMeResponse | ApiError>('/api/panel/get/me', { isAuth: true });
