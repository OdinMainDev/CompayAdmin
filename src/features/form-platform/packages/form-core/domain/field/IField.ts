import type { ValidationResult } from "../validation/ValidationResult";

export interface IField<
  T = any, 
  ExtraProps extends Record<string, any> = {}
> {
  name: string;            
  label: string;
  value: T;
  type: string;
  validate(): ValidationResult;
  toJSON(): any;

  extra?: ExtraProps;    
}
