export interface Merchant {
    readonly id: number;
    readonly name: string;
    readonly slug: string;
    readonly is_active: boolean;
    readonly created_at: string;
    readonly updated_at?: string;
  }
  
  export interface User {
    readonly id: number;
    readonly username: string;
    readonly is_admin: boolean;
    readonly merchant_id: number | null;
    readonly is_banned: boolean;
    readonly created_at: string;
    readonly updated_at?: string;
    readonly last_login_at?: string;
    readonly is_twofa_enabled?: boolean;
  }
  
  export interface CreateUserRequest {
    readonly username: string;
    readonly password: string;
    readonly is_admin: boolean;
    readonly merchant_id: number;
  }
  
  export interface UpdateUserRequest {
    readonly id: number;
    readonly username?: string;
    readonly password?: string;
    readonly is_banned: boolean;
    readonly do_disable_twofa?: boolean;
  }