import { Entity } from "./entity";

export class User implements Entity {
  constructor(
    public readonly id: number,
    public readonly username: string,
    public readonly is_banned: boolean,
    public readonly is_admin: boolean,
    public readonly merchant_id: number | null,
    public readonly is_twofa_enabled: boolean,
    public readonly created_at: string,
    public readonly updated_at: string
  ) {}
}
