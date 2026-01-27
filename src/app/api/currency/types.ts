import { Currency } from '@/app/entities/currency';
import { FilterReponse } from '@/features/api-client/types/datatable';

export type GetListFiltersResponse = {
  readonly success: boolean;
  readonly data: FilterReponse[];
};

export interface CurrencyProcessRequest {
  id?: number;
  code_alpha: string;
  title: string;
  network: string;
  is_coin: boolean;
  minor_units: number;
}

export interface CurrencyResponse {
  readonly success: boolean;
  readonly data: Currency;
}
