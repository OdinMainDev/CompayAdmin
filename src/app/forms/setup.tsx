import { withErrors } from '@/features/form-builder/form-react-adapter/FieldRenderers';
import { UnifiedFieldRegistry } from '@/features/form-builder/form-react-adapter/UnifiedFieldRegistry';

import { MerchantFieldRenderer } from './components/Merchant';
import { MerchantField } from './fields/MerchantField';
import { CurrencyField } from './fields/CurrencyField';
import { CurrencyFieldRenderer } from './components/Currency';

UnifiedFieldRegistry.registerFunction<number | null>(
  'merchant_id',
  MerchantField,
  withErrors(MerchantFieldRenderer),
);

UnifiedFieldRegistry.registerFunction<number | null>(
  'currency',
  CurrencyField,
  withErrors(CurrencyFieldRenderer),
);
