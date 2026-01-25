import { Entity } from "./entity";
import { ClientData } from "./client_data";

export class LogAuth implements Entity {
  constructor( 
    public readonly id: number,
    public readonly user_id: number,
    public readonly merchant_id: number,
    public readonly action: string,
    public readonly url: string,
    public readonly fingerprint: string,
    public readonly ip: string,
    public readonly user_agent: string,
    public readonly client_data: ClientData,
    public readonly created_at: number,
    public readonly updated_at: number
  ) {}
}