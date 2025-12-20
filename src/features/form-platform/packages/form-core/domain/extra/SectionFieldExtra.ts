import type { IField } from "../field/IField";

export interface SectionFieldExtra {
    description?: string;
    fields: IField<any>[]; 
  }
  