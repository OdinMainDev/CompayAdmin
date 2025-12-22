import type { IField } from "../field/IField";
import type { BaseFieldExtra } from "./BaseFieldExtra";

export interface TabConfig {
    name: string;
    label: string;
    elements: IField<unknown, BaseFieldExtra>[]; 
  }
  
  export interface TabsFieldExtra  extends BaseFieldExtra {
    tabs: TabConfig[];
  }
  