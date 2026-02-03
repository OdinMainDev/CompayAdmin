import {
  TextField,
  TextareaField,
  PasswordField,
  NumberField,
  SelectStringField,
  SelectNumberField,
  SwitchField,
  MultiSelectField,
  ImageField,
} from '@/features/form-builder/form-core/domain/field';
import type { BaseField } from '@/features/form-builder/form-core/domain/field/BaseField';
import type { BaseFieldExtra } from '@/features/form-builder/form-core/domain/extra/BaseFieldExtra';
import { OptionalSwitchField } from '../form-core/domain/field/OptionalSwitchField';
import { MultiSelectNumberField } from '../form-core/domain/field/MultiSelectNumberField';
import { DaterangeField } from '../form-core/domain/field/DaterangeField';
import { RepeaterField } from '../form-core/domain/field/RepeaterField';
import { TabField } from '../form-core/domain/field/TabField';

export const FieldClasses = {
  TextField,
  TextareaField,
  PasswordField,
  NumberField,
  SelectStringField,
  SelectNumberField,
  SwitchField,
  OptionalSwitchField,
  MultiSelectField,
  MultiSelectNumberField,
  ImageField,
  RepeaterField,
  DaterangeField,
  TabField,
} as const;

export type PackageFields = InstanceType<(typeof FieldClasses)[keyof typeof FieldClasses]>;

export interface CustomFields {
  [key: string]: abstract new (...args: unknown[]) => BaseField<unknown, BaseFieldExtra>;
}

export type AnyField = PackageFields | InstanceType<CustomFields[keyof CustomFields]>;
