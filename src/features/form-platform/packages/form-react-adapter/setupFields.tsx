import { UnifiedFieldRegistry } from './UnifiedFieldRegistry';
import { withValidation } from './FieldRenderers';
import {
  TextField, TextareaField, PasswordField, NumberField,
  ImageField, SwitchField, SelectStringField, SelectNumberField, MultiSelectField,
  type ImageValue
} from '../form-core/domain/field';
import { PrimitiveFieldRenderer } from './components/PrimitiveField';
import { ImageInput } from './components/ImageInput';
import { SwitchRenderer } from './components/Switch';
import { MultiSelectNumberField } from '../form-core/domain/field/MultiSelectNumberField';
import { TabField, type TabFieldValue } from '../form-core/domain/field/TabField';
import type { TabsFieldExtra } from '../form-core/domain/extra/TabFieldExtra';
import { TabsRenderer } from './components/Tabs';
import { RepeaterField, type RepeaterFieldExtra, type RepeaterFieldValue } from '../form-core/domain/field/RepeaterField';
import { RepeaterRenderer } from './components/Repeater';
import { SingleSelectRenderer } from './components/Select';
import { MultiSelectRenderer } from './components/MultiSelect';


UnifiedFieldRegistry.registerFunction<TabFieldValue, TabsFieldExtra>('tabs', TabField, TabsRenderer);
UnifiedFieldRegistry.registerFunction<string>('text', TextField, withValidation(PrimitiveFieldRenderer));
UnifiedFieldRegistry.registerFunction<string>('textarea', TextareaField, withValidation(PrimitiveFieldRenderer));
UnifiedFieldRegistry.registerFunction<string>('password', PasswordField, withValidation(PrimitiveFieldRenderer));
UnifiedFieldRegistry.registerFunction<number | null>('number', NumberField, withValidation(PrimitiveFieldRenderer));
UnifiedFieldRegistry.registerFunction<string>('select', SelectStringField, withValidation(SingleSelectRenderer));
UnifiedFieldRegistry.registerFunction<number>('select-number', SelectNumberField, withValidation(SingleSelectRenderer));
UnifiedFieldRegistry.registerFunction<boolean>('switch', SwitchField, withValidation(SwitchRenderer));
UnifiedFieldRegistry.registerFunction<string[]>('multiselect', MultiSelectField, withValidation(MultiSelectRenderer));
UnifiedFieldRegistry.registerFunction<number[]>('multiselect-number', MultiSelectNumberField, withValidation(MultiSelectRenderer));
UnifiedFieldRegistry.registerFunction<ImageValue>('image',ImageField, withValidation(ImageInput));
UnifiedFieldRegistry.registerFunction<RepeaterFieldValue, RepeaterFieldExtra>('repeater', RepeaterField, RepeaterRenderer);