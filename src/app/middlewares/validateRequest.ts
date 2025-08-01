import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";
import AppError from "../helpers/appError";

export const validateRequest =
  (zodSchema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body) throw new AppError(400, "Request body is empty.");
      req.body = await zodSchema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
