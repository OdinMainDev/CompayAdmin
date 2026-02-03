export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  readonly success: boolean;
  readonly token: string;
};

export type TotpRequest = {
  code: string;
};

export type TotpResponse = {
  readonly success: boolean;
  readonly data: string;
};
