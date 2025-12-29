export interface DatatableResponse<T = unknown> {
    data: T[];
    total: number;
    filtered?: number;
    success?: boolean;
    message?: string;
  }
  
  export interface IResponseList<T = unknown> {
    success: boolean;
    data: {
      data: T[];
      recordsCount: number;
      recordsFiltered: number;
      recordsTotal: number;
    };
    message?: string;
  }
  
  