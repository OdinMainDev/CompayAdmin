import type { IField } from '../form-core/domain/field/IField';
import type { ReactElement } from 'react';

export function typedRenderer<T, ExtraProps extends Record<string, any>>(
  renderer: (field: IField<T, ExtraProps>, onChange: (v: T) => void) => ReactElement
): (field: IField<T>, onChange: (v: T) => void) => ReactElement {
  return renderer as any;
}
