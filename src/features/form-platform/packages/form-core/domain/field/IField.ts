import type { BaseFieldExtra } from "../extra/BaseFieldExtra";
import type { ValidationResult } from "../validation/ValidationResult";

export type AnyField = IField<any, BaseFieldExtra>;

export interface IField<
  T = any, 
  ExtraProps extends Record<string, any> = {}
> {
  name: string;            
  label: string;
  value: T;
  type: string;
  validate(): ValidationResult;
  getChildren?(): AnyField[];
  toJSON(): any;

  extra?: ExtraProps;    
}
