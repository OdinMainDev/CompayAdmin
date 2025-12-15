import { postRequest, type ApiError } from "../request";

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  token?: string;
  error?: string;
  errors?: Record<string, string>;
};

export const authLogin = (payload: LoginPayload) =>
  postRequest<LoginResponse | ApiError>('/api/auth/login', { isAuth: false, body: payload, hasToast: true });
