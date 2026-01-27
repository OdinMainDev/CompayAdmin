export interface IResponseList<T> {
  success: boolean;
  data: {
    data: T[];
    recordsCount: number;
    recordsFiltered: number;
    recordsTotal: number;
  };
}
