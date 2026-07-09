// export interface ApiResponse<T> {
//     statusCode: number;
//     message: string;
//     data: T;
//   }

export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: {
      id: string;
      total: number;
      item: T;
      items: T[];
    }
  }