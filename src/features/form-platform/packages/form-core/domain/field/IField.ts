import type { BaseFieldExtra } from "../extra/BaseFieldExtra";
import type { ValidationResult } from "../validation/ValidationResult";

export type AnyField = IField<unknown, BaseFieldExtra>;

export interface IField<
  T = unknown, 
  E extends BaseFieldExtra = BaseFieldExtra
> {
  name: string;            
  label: string;
  value: T;
  type: string;
  validate(): ValidationResult;
  toJSON(): AnyField;

  extra?: E;    
}
