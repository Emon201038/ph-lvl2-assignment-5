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
exports.UserController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const httpStatus_1 = require("../../utils/httpStatus");
const user_service_1 = require("./user.service");
const appError_1 = __importDefault(require("../../helpers/appError"));
const createUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.UserService.createUser(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.HTTP_STATUS.CREATED,
        message: "User created successfully.",
        data: user,
    });
}));
const getUsers = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.HTTP_STATUS.OK,
        message: "All users retrieved successfully.",
        data: yield user_service_1.UserService.getAllUsers(req.query),
    });
}));
const getUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.HTTP_STATUS.OK,
        message: "User retrieved successfully.",
        data: yield user_service_1.UserService.getUser(req.params.id),
    });
}));
const updateUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.UserService.updateUser(req.params.id, req.body, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.HTTP_STATUS.OK,
        message: "User updated successfully.",
        data: user,
    });
}));
const updateUserRole = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.id !== req.user.userId) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.FORBIDDEN, "You are not authorized.");
    }
    const user = yield user_service_1.UserService.updateUserRole(req.params.id, req.body.role);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.HTTP_STATUS.OK,
        message: "User role updated successfully.",
        data: user,
    });
}));
const deleteUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.UserService.deleteUser(req.user, req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.HTTP_STATUS.OK,
        message: "User deleted successfully.",
        data: user,
    });
}));
exports.UserController = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    updateUserRole,
    deleteUser,
};
