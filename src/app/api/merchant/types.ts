import { Merchant } from "@/app/entities/merchant";
import { FilterReponse } from "@/features/api-client/types/datatable";

export interface MerchantCreateRequest {
  name: string;
  token: string;
  admin_username: string;
  admin_password: string;
}

export interface MerchantUpdateRequest {
  id: number;
  name: string;
  token: string;
  blocked_countries: string[];
  allowed_countries: string[];
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