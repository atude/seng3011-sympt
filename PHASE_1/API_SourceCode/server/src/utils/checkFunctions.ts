import { GenError } from "../types";

// eslint-disable-next-line import/prefer-default-export
export const isError = (object: GenError | any): object is GenError => "errorNo" in object;
