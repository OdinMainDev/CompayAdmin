import { postRequest, type ApiError } from '../request';

export interface TotpResponse {
  success: true;
  token: string;
}

export const authTotp = (code: string) =>
  postRequest<TotpResponse | ApiError>('/api/panel/auth/totp', { isAuth: true, body: { code }, hasToast: true });
