import { FilterReponse } from "@/features/api-client/types/datatable";

export type GetListFiltersResponse = {
  readonly success: boolean;
  readonly data: FilterReponse[];
};