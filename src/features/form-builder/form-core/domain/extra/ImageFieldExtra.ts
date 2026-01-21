import type { BaseFieldExtra } from './BaseFieldExtra';

export interface ImageFieldExtra extends BaseFieldExtra {
  accept?: string;      
  maxSizeMb?: number;    
}
