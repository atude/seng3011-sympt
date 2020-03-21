export type ApiLog = {
  timestamp: string;
  success: boolean;
  query: string;
  error: GenError | null;
};

export type GenError = {
  errorNo: number;
  errorName: string;
  errorMessage: string;
};
