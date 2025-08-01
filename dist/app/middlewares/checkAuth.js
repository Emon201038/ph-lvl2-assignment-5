"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const appError_1 = __importDefault(require("../helpers/appError"));
const httpStatus_1 = require("../utils/httpStatus");
const jwt_1 = require("../utils/jwt");
const checkAuth = (...roles) => (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.UNAUTHORIZED, "You are not logged in.");
    }
    ;
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.UNAUTHORIZED, "You are not logged in.");
    }
    ;
    const decoded = (0, jwt_1.verifyJwt)(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET);
    if (!decoded) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.UNAUTHORIZED, "You are not logged in.");
    }
    ;
    if (!roles.includes(decoded.role)) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.UNAUTHORIZED, "You are not authorized to access this route.");
    }
    ;
    req.user = decoded;
    next();
}));
exports.checkAuth = checkAuth;
