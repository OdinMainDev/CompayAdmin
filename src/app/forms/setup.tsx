import { withErrors } from '@/features/form-builder/form-react-adapter/FieldRenderers';
import { UnifiedFieldRegistry } from '@/features/form-builder/form-react-adapter/UnifiedFieldRegistry';

import { MerchantFieldRenderer } from './components/Merchant';
import { CurrencyFieldRenderer } from './components/Currency';

import '@/features/form-builder/form-react-adapter/fields';
import { MerchantField } from './fields/MerchantField';
import { CurrencyField } from './fields/CurrencyField';

declare module '@/features/form-builder/form-react-adapter/fields' {
  interface CustomFields {
    MerchantField: typeof MerchantField;
    CurrencyField: typeof CurrencyField;
  }
}

UnifiedFieldRegistry.registerFunction<number | null>(
  'merchant_id',
  MerchantField,
  withErrors(MerchantFieldRenderer),
);

UnifiedFieldRegistry.registerFunction<number | null | string>(
  'currency',
  CurrencyField,
  CurrencyFieldRenderer,
);
