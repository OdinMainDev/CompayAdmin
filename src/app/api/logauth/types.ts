import { LogAuth } from "@/app/entities/logauth";
import { FilterReponse } from "@/features/api-client/types/datatable";

export interface LogAuthCreateRequest {
  logauthname: string;
  password: string;
  is_admin: boolean;
  merchant_id?: number;
}

export interface LogAuthUpdateRequest {
  id: number;
  logauthname?: string;
  password?: string;
  is_banned?: boolean;
  do_disable_twofa?: boolean;
}

export interface LogAuthResponse {
  readonly success: boolean;
  readonly data: LogAuth;
}

export type GetListFiltersResponse = {
  success: boolean;
  data: FilterReponse[];
};

export interface LogAuthSearchResponse {
  readonly success: boolean;
  readonly data: LogAuth[];
}