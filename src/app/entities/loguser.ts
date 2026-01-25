import { Entity } from "./entity";
import { ClientData } from "./client_data";

export class LogUser implements Entity {
  constructor( 
    public readonly id: number,
    public readonly user_id: number,
    public readonly merchant_id: number,
    public readonly action: string,
    public readonly url: string,
    public readonly request: string,
    public readonly client_data: ClientData,
    public readonly created_at: number,
    public readonly updated_at: number
  ) {}
}