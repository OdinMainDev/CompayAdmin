import type { SelectFieldExtra } from "../../form-core/domain/extra/SelectFieldExtra";
import type { IField } from "../../form-core/domain/field/IField";
import { BaseSelectRenderer } from "./BaseSelect";


export function MultiSelectRenderer<T extends string | number>(
  field: IField<T[], SelectFieldExtra>,
  onChange: (value: T[]) => void,
  hasError: boolean
) {
  return <BaseSelectRenderer<T> field={field} onChange={onChange} hasError={hasError} isMulti={true} />;
}