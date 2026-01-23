export interface User {
  readonly id: number;
  readonly username: string;
  readonly is_banned: boolean;
  readonly is_admin: boolean;
  readonly merchant_id: number | null;
  readonly is_twofa_enabled: boolean;
  readonly created_at: string;
  readonly updated_at: string;
}