import { createTypeGuard, isObjectWith } from '../types/utils';
import type { 
  LoginRequest, 
  LoginResponseData, 
  TotpRequest, 
  TotpResponseData,
  VerifyTokenResponseData 
} from '../types/auth';

export const isLoginRequest = createTypeGuard<LoginRequest>(
  (value): value is LoginRequest => {
    return isObjectWith({
      email: (v): v is string => typeof v === 'string' && v.includes('@'),
      password: (v): v is string => typeof v === 'string' && v.length >= 6,
    })(value);
  }
);

export const isTotpRequest = createTypeGuard<TotpRequest>(
  (value): value is TotpRequest => {
    return isObjectWith({
      code: (v): v is string => typeof v === 'string' && /^\d{6}$/.test(v),
    })(value);
  }
);

export const isLoginResponseData = createTypeGuard<LoginResponseData>(
  (value): value is LoginResponseData => {
    return isObjectWith({
      token: (v): v is string => typeof v === 'string' && v.length > 0,
      user: (v): v is LoginResponseData['user'] => 
        isObjectWith({
          id: (id): id is number => typeof id === 'number' && id > 0,
          username: (u): u is string => typeof u === 'string' && u.length > 0,
          is_admin: (a): a is boolean => typeof a === 'boolean',
          merchant_id: (m): m is number | null => 
            m === null || (typeof m === 'number' && m > 0),
        })(v),
    })(value);
  }
);

export const isTotpResponseData = createTypeGuard<TotpResponseData>(
  (value): value is TotpResponseData => {
    return isObjectWith({
      token: (v): v is string => typeof v === 'string' && v.length > 0,
      requires_password_change: (v): v is boolean | undefined => 
        v === undefined || typeof v === 'boolean',
    })(value);
  }
);

export const isVerifyTokenResponseData = createTypeGuard<VerifyTokenResponseData>(
  (value): value is VerifyTokenResponseData => {
    return isObjectWith({
      valid: (v): v is boolean => typeof v === 'boolean',
      user: (v): v is LoginResponseData['user'] | undefined => 
        v === undefined || isObjectWith({
          id: (id): id is number => typeof id === 'number' && id > 0,
          username: (u): u is string => typeof u === 'string' && u.length > 0,
          is_admin: (a): a is boolean => typeof a === 'boolean',
          merchant_id: (m): m is number | null => 
            m === null || (typeof m === 'number' && m > 0),
        })(v),
    })(value);
  }
);