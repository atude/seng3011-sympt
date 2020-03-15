import { GenError } from "../types";

const generateError = (errorNo: number, errorName: string, errorMessage: string) => ({
  errorNo,
  errorName,
  errorMessage,
} as GenError);

export default generateError;
