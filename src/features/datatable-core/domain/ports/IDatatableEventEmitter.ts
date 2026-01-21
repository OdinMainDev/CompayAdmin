export interface IDatatableEventEmitter {
    emit(event: string, data: unknown): void;
    on(event: string, handler: (data: unknown) => void): () => void;
    off(event: string, handler: (data: unknown) => void): void;
    once(event: string, handler: (data: unknown) => void): void;
  }