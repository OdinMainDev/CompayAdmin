import type { SelectFieldExtra } from "@/features/form-builder/form-core/domain/extra/SelectFieldExtra";
import type { IField } from "@/features/form-builder/form-core/domain/field/IField";
import { BaseSelectRenderer } from "./BaseSelect";


export function SingleSelectRenderer<T extends string | number>(
  field: IField<T, SelectFieldExtra>,
  onChange: (value: T) => void,
  hasError: boolean
) {
  return <BaseSelectRenderer<T> field={field} onChange={onChange} hasError={hasError} isMulti={false} />;
}