import { FilterReponse } from "@/features/api-client/types/datatable";

export type GetListFiltersResponse = {
  success: boolean;
  data: FilterReponse[];
};