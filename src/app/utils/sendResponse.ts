import { Response } from "express";

export interface IMeta {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface IResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
  meta?: IMeta;
};

export const sendResponse = <T>(res: Response, data: IResponse<T>) => res
  .status(data.statusCode)
  .json({
    success: true,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data,
    meta: data.meta
  });