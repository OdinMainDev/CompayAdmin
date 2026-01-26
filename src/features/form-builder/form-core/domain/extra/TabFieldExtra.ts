import { AnyField } from "@/features/form-builder/form-react-adapter/fields";
import type { BaseFieldExtra } from "./BaseFieldExtra";

export interface TabConfig {
    name: string;
    label: string;
    elements: AnyField[]
  }
  
  export interface TabsFieldExtra  extends BaseFieldExtra {
    tabs: TabConfig[];
  }
  