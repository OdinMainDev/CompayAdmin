import {
  Merchant,
  MerchantAmounts,
  MerchantConfirmations,
  MerchantFees,
} from '@/app/entities/merchant';
import { FilterReponse } from '@/features/api-client/types/datatable';

export interface MerchantCreateRequest {
  name: string;
  admin_username: string;
  admin_password: string;
}

export interface MerchantUpdateRequest {
  id: number;
  name: string;
  blocked_countries: string[];
  allowed_countries: string[];
  notification_telegram_chat_id: number;
  minimum_amounts: MerchantAmounts[];
  minimum_confirmations: MerchantConfirmations[];
  fee_amounts: MerchantFees[];
  fee_percent_amounts: MerchantFees[];
}

export interface MerchantResponse {
  readonly success: boolean;
  readonly data: Merchant;
}

export type GetListFiltersResponse = {
  readonly success: boolean;
  readonly data: FilterReponse[];
};

export interface MerchantSearchRequest {
  search: string;
}

export interface MerchantSearchResponse {
  readonly success: boolean;
  readonly data: Merchant[];
}
