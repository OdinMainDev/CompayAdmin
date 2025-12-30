// export interface DatatableResponse<T> {
//     data: T[];
//     recordsTotal: number;
//     recordsFiltered: number;
//     recordsCount: number;
//   }
  
  export interface IResponseList<T> {
    success: boolean;
    data: {
      data: T[];
      recordsCount: number;
      recordsFiltered: number;
      recordsTotal: number;
    };
  }
  
  