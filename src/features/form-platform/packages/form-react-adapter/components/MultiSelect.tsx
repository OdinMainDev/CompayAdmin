import type { SelectFieldExtra } from "../../form-core/domain/extra/SelectFieldExtra";
import type { IField } from "../../form-core/domain/field/IField";
import { BaseSelectRenderer } from "./BaseSelect";


export function MultiSelectRenderer<T extends string | number>(
  field: IField<T[], SelectFieldExtra>,
  onChange: (value: T[]) => void
) {
  return <BaseSelectRenderer<T> field={field} onChange={onChange} isMulti={true} />;
}