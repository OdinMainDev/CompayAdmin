import { Entity } from "./entity";

export class Currency implements Entity {
  constructor( 
    public readonly id: number,
    public readonly code_alpha: string,
    public readonly title: string,
    public readonly network: string,
    public readonly image: string,
    public readonly is_coin: boolean,
    public readonly minor_units: number,
    public readonly created_at: number,
    public readonly updated_at: number
  ) {}
}