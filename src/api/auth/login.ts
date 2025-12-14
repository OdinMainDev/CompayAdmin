import { postRequest, type ApiError } from "../request";

export type LoginPayload = {
  email: string;
  password: string;
  api_key: string;
};

export type LoginResponse = {
  success: boolean;
  token?: string;
  error?: string;
  errors?: Record<string, string>;
};

export const authLogin = (payload: LoginPayload) =>
  postRequest<LoginResponse | ApiError>('/api/panel/auth/login', { isAuth: false, body: payload, hasToast: true });
