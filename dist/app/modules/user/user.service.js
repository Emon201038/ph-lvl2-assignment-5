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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const appError_1 = __importDefault(require("../../helpers/appError"));
const httpStatus_1 = require("../../utils/httpStatus");
const queryBuilder_1 = require("../../utils/queryBuilder");
const user_interface_1 = require("./user.interface");
const user_model_1 = __importDefault(require("./user.model"));
const getAllUsers = (queries) => __awaiter(void 0, void 0, void 0, function* () {
    const builder = new queryBuilder_1.QueryBuilder(user_model_1.default, queries);
    const res = yield builder
        .filter()
        .search(["email", "name", "phone"])
        .paginate()
        .select(["-password"])
        .execWithMeta();
    return { users: res.data, meta: res.meta };
});
const getUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(userId).select("-password");
    return user;
});
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = payload, res = __rest(payload, ["email"]);
    // check if user already exist
    const isExists = yield user_model_1.default.findOne({ email });
    if (isExists) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.CONFLICT, "User already exist with this email.");
    }
    const auth = {
        provider: user_interface_1.AuthProvider.CREDENTIALS,
        providerId: email,
    };
    const user = yield user_model_1.default.create(Object.assign(Object.assign({ email }, res), { auths: [auth] }));
    return user;
});
const updateUser = (userId, payload, loggedInUser) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(userId);
    if (!user) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.NOT_FOUND, "User not found.");
    }
    if (payload.email) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.FORBIDDEN, "You can't update email.");
    }
    if (loggedInUser.role !== user_interface_1.UserRole.ADMIN) {
        if (user.isDeleted || user.isBlocked) {
            throw new appError_1.default(httpStatus_1.HTTP_STATUS.FORBIDDEN, "User is blocked or deleted.");
        }
        if (payload.role === user_interface_1.UserRole.ADMIN) {
            throw new appError_1.default(httpStatus_1.HTTP_STATUS.FORBIDDEN, "Your not authorized to update role.");
        }
        if (payload.isBlocked || payload.isVerified) {
            throw new appError_1.default(httpStatus_1.HTTP_STATUS.FORBIDDEN, "Your not authorized to update status.");
        }
    }
    if (payload.password) {
        const isMatchPass = yield bcryptjs_1.default.compare(payload.currentPassword, user.password);
        if (!isMatchPass) {
            throw new appError_1.default(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "Invalid password.");
        }
    }
    return yield user_model_1.default.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
});
const updateUserRole = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(userId);
    if (!user) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.NOT_FOUND, "User not found.");
    }
    if (user.role === user_interface_1.UserRole.ADMIN) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.FORBIDDEN, "You can't update role.");
    }
    if (user.parcels.length > 0) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.FORBIDDEN, "You can't update role. Better you can create new account");
    }
    return yield user_model_1.default.findByIdAndUpdate(userId, { role }, { new: true, runValidators: true });
});
const deleteUser = (loggedInUser, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(userId);
    if (!user) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.NOT_FOUND, "User not found.");
    }
    if (user.role === user_interface_1.UserRole.ADMIN) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.FORBIDDEN, "You are not authorized to delete this user.");
    }
    if (loggedInUser.role !== user_interface_1.UserRole.ADMIN) {
        if (loggedInUser.userId !== user._id.toString()) {
            throw new appError_1.default(httpStatus_1.HTTP_STATUS.FORBIDDEN, "You are not authorized to delete this user.");
        }
        if (user.isDeleted || user.isBlocked) {
            throw new appError_1.default(httpStatus_1.HTTP_STATUS.FORBIDDEN, "User is blocked or deleted.");
        }
    }
    return yield user_model_1.default.findByIdAndUpdate(userId, { isDeleted: true }, { new: true, runValidators: true });
});
exports.UserService = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    updateUserRole,
    deleteUser,
};
