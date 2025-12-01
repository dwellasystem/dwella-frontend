export interface IServiceError {
  status: number | null;
  data: {
    detail?: string;
    [key: string]: any;
  } | null;
  message: string;
}