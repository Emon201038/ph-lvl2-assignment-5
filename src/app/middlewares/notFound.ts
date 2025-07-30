/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../utils/httpStatus";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: "Route not found" });
};