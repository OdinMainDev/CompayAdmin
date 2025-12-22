import type { BaseFieldExtra } from "../extra/BaseFieldExtra";

export type AnyField = IField<any, BaseFieldExtra>;

export interface IField<
  T = any, 
  ExtraProps extends Record<string, any> = {}
> {
  name: string;            
  label: string;
  value: T;
  type: string;
  toJSON(): any;

  extra?: ExtraProps;    
}
