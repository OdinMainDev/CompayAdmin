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
import { OptionalSwitchField } from '../form-core/domain/field/OptionalSwitchField';
import { MultiSelectNumberField } from '../form-core/domain/field/MultiSelectNumberField';
import { DaterangeField } from '../form-core/domain/field/DaterangeField';
import { RepeaterField } from '../form-core/domain/field/RepeaterField';
import { TabField } from '../form-core/domain/field/TabField';
import { MerchantField } from '@/app/forms/fields/MerchantField';

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
  MerchantField,
} as const;

export type AnyField = InstanceType<(typeof FieldClasses)[keyof typeof FieldClasses]>;
