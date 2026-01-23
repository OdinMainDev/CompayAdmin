export type IFilter = {
  name: string;
  type: string;
  values: number | string | string[] | number[];
};

export type IFilterResponse = {
  success: boolean;
  data: IFilter[];
};
