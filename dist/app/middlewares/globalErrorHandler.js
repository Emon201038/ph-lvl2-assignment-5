"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const env_1 = require("../config/env");
const appError_1 = __importDefault(require("../helpers/appError"));
const httpStatus_1 = require("../utils/httpStatus");
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = "Something went wrong!";
    let errorSources = [];
    // Mongoose Duplicate key error
    if (err.code === 11000) {
        statusCode = httpStatus_1.HTTP_STATUS.CONFLICT;
        const matchedPart = err.message.match(/"([^"]*)"/);
        message = `${matchedPart === null || matchedPart === void 0 ? void 0 : matchedPart[1]} already exists.`;
    }
    // Mongoose CastError
    else if (err.name === "CastError") {
        statusCode = httpStatus_1.HTTP_STATUS.BAD_REQUEST;
        message = `Invalid mongoDB ObjectId. Please provide a valid mongoDB ObjectId.`;
    }
    // Mongoose Validation Error
    else if (err.name === "ValidationError") {
        statusCode = httpStatus_1.HTTP_STATUS.BAD_REQUEST;
        errorSources = Object.values(err.errors).map((error) => {
            return {
                path: error.path,
                message: error.message
            };
        });
    }
    // Zod Error
    else if (err.name === "ZodError") {
        statusCode = httpStatus_1.HTTP_STATUS.BAD_REQUEST;
        message = "Zod validation error";
        errorSources = err.issues.map((error) => {
            return {
                path: error.path[error.path.length - 1],
                message: error.message
            };
        });
    }
    // AppError
    else if (err instanceof appError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
    }
    // Generic Error
    else if (err instanceof Error) {
        message = err.message;
        statusCode = 500;
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorSources: env_1.envVars.NODE_ENV === "development" ? errorSources : null,
        err: env_1.envVars.NODE_ENV === "development" ? err : null,
        stack: env_1.envVars.NODE_ENV === "development" ? err.stack : null
    });
};
exports.globalErrorHandler = globalErrorHandler;
