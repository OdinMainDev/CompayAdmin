export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  readonly success: boolean;
  readonly token: string;
};