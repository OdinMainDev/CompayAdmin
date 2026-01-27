import { withErrors } from "@/features/form-builder/form-react-adapter/FieldRenderers";
import { UnifiedFieldRegistry } from "@/features/form-builder/form-react-adapter/UnifiedFieldRegistry";

import { MerchantFieldRenderer } from "./components/Merchant";
import { MerchantField } from "./fields/MerchantField";

UnifiedFieldRegistry.registerFunction<number | null>(
  "merchant_id",
  MerchantField,
  withErrors(MerchantFieldRenderer)
);

