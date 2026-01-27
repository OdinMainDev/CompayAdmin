import { Entity } from './entity';

export class Notification implements Entity {
  constructor(
    public readonly id: number,
    public readonly is_read: boolean,
    public readonly action: string,
    public readonly text: string,
    public readonly created_at: number,
    public readonly updated_at: number,
  ) {}
}
