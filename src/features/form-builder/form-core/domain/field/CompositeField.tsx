import { AnyField } from "@/features/form-builder/form-react-adapter/fields";

export interface CompositeField {
    readonly isComposite: true;
    getChildren(): AnyField[];
    replaceChildren(children: AnyField[]): void;
  }
  