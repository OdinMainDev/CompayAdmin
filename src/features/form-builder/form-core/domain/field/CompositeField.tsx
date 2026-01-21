import type { AnyField } from "./IField";

export interface CompositeField {
    getChildren(): unknown[];
    replaceChildren(children: AnyField[]): void;
  }
  