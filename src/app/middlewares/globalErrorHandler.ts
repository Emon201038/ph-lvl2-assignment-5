/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../helpers/appError";
import { HTTP_STATUS } from "../utils/httpStatus";

interface IErrorSources {
  path: string;
  message: string;
}

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorSources: IErrorSources[] = [];

  // Mongoose Duplicate key error
  if (err.code === 11000) {
    statusCode = HTTP_STATUS.CONFLICT;
    const matchedPart = err.message.match(/"([^"]*)"/);
    message = `${matchedPart?.[1]} already exists.`;
  }
  // Mongoose CastError
  else if (err.name === "CastError") {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = `Invalid mongoDB ObjectId. Please provide a valid mongoDB ObjectId.`
  }
  // Mongoose Validation Error
  else if (err.name === "ValidationError") {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    errorSources = Object.values(err.errors).map((error: any) => {
      return {
        path: error.path,
        message: error.message
      };
    });
  }
  // Zod Error
  else if (err.name === "ZodError") {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = "Zod validation error";
    errorSources = err.issues.map((error: any) => {
      return {
        path: error.path[error.path.length - 1],
        message: error.message
      };
    });
  }
  // AppError
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // Generic Error
  else if (err instanceof Error) {
    message = err.message
    statusCode = 500
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources: envVars.NODE_ENV === "development" ? errorSources : null,
    err: envVars.NODE_ENV === "development" ? err : null,
    stack: envVars.NODE_ENV === "development" ? err.stack : null
  });
}