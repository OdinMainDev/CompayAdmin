import { UnifiedFieldRegistry } from './UnifiedFieldRegistry';
import { withValidation } from './FieldRenderers';
import {
  TextField, TextareaField, PasswordField, NumberField,
  ImageField, SwitchField, SelectStringField, SelectNumberField, MultiSelectField,
  type ImageValue
} from '../form-core/domain/field';
import { PrimitiveFieldRenderer } from './components/PrimitiveField';
import { ImageInput } from './components/ImageInput';
import { SelectRenderer } from './components/Select';
import { MultiSelectRenderer } from './components/MultiSelect';
import { SwitchRenderer } from './components/Switch';
import { MultiSelectNumberField } from '../form-core/domain/field/MultiSelectNumberField';
import { TabField, type TabFieldExtra } from '../form-core/domain/field/TabField';
import { TabRenderer } from './components/Tab';




UnifiedFieldRegistry.register<null, TabFieldExtra>('tab', TabField, withValidation(TabRenderer));


UnifiedFieldRegistry.register<string>( 'text', TextField, withValidation(PrimitiveFieldRenderer) );
UnifiedFieldRegistry.register<string>( 'textarea', TextareaField, withValidation(PrimitiveFieldRenderer) );
UnifiedFieldRegistry.register<string>( 'password', PasswordField, withValidation(PrimitiveFieldRenderer) );
UnifiedFieldRegistry.register<number>( 'number', NumberField, withValidation(PrimitiveFieldRenderer) );
UnifiedFieldRegistry.register<ImageValue>( 'image', ImageField, withValidation(ImageInput) );
UnifiedFieldRegistry.register<boolean>( 'switch', SwitchField, withValidation(SwitchRenderer) );
UnifiedFieldRegistry.register<string>( 'select', SelectStringField, withValidation(SelectRenderer) );
UnifiedFieldRegistry.register<number>( 'select-number', SelectNumberField, withValidation(SelectRenderer) );
UnifiedFieldRegistry.register<string[]>( 'multiselect', MultiSelectField, withValidation(MultiSelectRenderer) );
UnifiedFieldRegistry.register<number[]>( 'multiselect-number', MultiSelectNumberField, withValidation(MultiSelectRenderer) );

