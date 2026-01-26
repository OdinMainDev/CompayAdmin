import { UnifiedFieldRegistry } from './UnifiedFieldRegistry';
import { withErrors, withValidation } from './FieldRenderers';
import {
  TextField, TextareaField, PasswordField, NumberField,
  ImageField, SwitchField, SelectStringField, SelectNumberField, MultiSelectField,
  type ImageValue
} from '@/features/form-builder/form-core/domain/field';
import { PrimitiveFieldRenderer } from './components/PrimitiveField';
import { ImageInput } from './components/ImageInput';
import { SwitchRenderer } from './components/Switch';
import { MultiSelectNumberField } from '@/features/form-builder/form-core/domain/field/MultiSelectNumberField';
import { TabField, type TabFieldValue } from '@/features/form-builder/form-core/domain/field/TabField';
import type { TabsFieldExtra } from '@/features/form-builder/form-core/domain/extra/TabFieldExtra';
import { TabsRenderer } from './components/Tabs';
import { RepeaterField, type RepeaterFieldExtra, type RepeaterFieldValue } from '@/features/form-builder/form-core/domain/field/RepeaterField';
import { RepeaterRenderer } from './components/Repeater';
import { SingleSelectRenderer } from './components/Select';
import { MultiSelectRenderer } from './components/MultiSelect';
import { OptionalSwitchField } from '@/features/form-builder/form-core/domain/field/OptionalSwitchField';
import { OptionalSwitchRenderer } from './components/OptionalSwitch';
import { DaterangeField, type DaterangeValue } from '@/features/form-builder/form-core/domain/field/DaterangeField';
import type { DaterangeFieldExtra } from '@/features/form-builder/form-core/domain/extra/DaterangeFieldExtra';
import { DaterangeRenderer } from './components/Daterange';
import { MerchantField } from '../../../app/datatable/custom/fields/MerchantField';
import { MerchantFieldRenderer } from '../../../app/datatable/custom/components/Merchant';


UnifiedFieldRegistry.registerFunction<TabFieldValue, TabsFieldExtra>('tabs', TabField, TabsRenderer);
UnifiedFieldRegistry.registerFunction<string>('text', TextField, withValidation(PrimitiveFieldRenderer));
UnifiedFieldRegistry.registerFunction<string>('textarea', TextareaField, withValidation(PrimitiveFieldRenderer));
UnifiedFieldRegistry.registerFunction<string>('password', PasswordField, withValidation(PrimitiveFieldRenderer));
UnifiedFieldRegistry.registerFunction<number | null>('number', NumberField, withValidation(PrimitiveFieldRenderer));
UnifiedFieldRegistry.registerFunction<string>('select', SelectStringField, withValidation(SingleSelectRenderer));
UnifiedFieldRegistry.registerFunction<number>('select-number', SelectNumberField, withValidation(SingleSelectRenderer));
UnifiedFieldRegistry.registerFunction<boolean>('switch', SwitchField, SwitchRenderer);
UnifiedFieldRegistry.registerFunction<boolean | null>('optional-switch', OptionalSwitchField, OptionalSwitchRenderer);
UnifiedFieldRegistry.registerFunction<string[]>('multiselect', MultiSelectField, withValidation(MultiSelectRenderer));
UnifiedFieldRegistry.registerFunction<number[]>('multiselect-number', MultiSelectNumberField, withValidation(MultiSelectRenderer));
UnifiedFieldRegistry.registerFunction<ImageValue>('image',ImageField, withValidation(ImageInput));
UnifiedFieldRegistry.registerFunction<RepeaterFieldValue, RepeaterFieldExtra>('repeater', RepeaterField, RepeaterRenderer);
UnifiedFieldRegistry.registerFunction<DaterangeValue, DaterangeFieldExtra>('date-range', DaterangeField, DaterangeRenderer);

UnifiedFieldRegistry.registerFunction<number | null>('merchant_id', MerchantField, withErrors(MerchantFieldRenderer));