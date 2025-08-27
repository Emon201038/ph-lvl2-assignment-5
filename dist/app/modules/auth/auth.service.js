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
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = __importDefault(require("../user/user.model"));
const appError_1 = __importDefault(require("../../helpers/appError"));
const httpStatus_1 = require("../../utils/httpStatus");
const user_interface_1 = require("../user/user.interface");
const jwt_1 = require("../../utils/jwt");
const env_1 = require("../../config/env");
const sendEmail_1 = require("../../utils/sendEmail");
const formatTime_1 = require("../../utils/formatTime");
// ✅
const changePassword = (token, oldPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(token.userId).select("password auths");
    if (!user) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.NOT_FOUND, "User not found");
    }
    if (!user.auths.find((auth) => auth.provider === user_interface_1.AuthProvider.CREDENTIALS) ||
        !user.password) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.UNAUTHORIZED, "User is not authenticated with credentials.");
    }
    const currentPassword = user.password;
    const isPasswordMatch = yield bcryptjs_1.default.compare(oldPassword, currentPassword);
    if (!isPasswordMatch) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "Invalid old password.");
    }
    user.password = newPassword;
    yield user.save();
    return true;
});
// ✅
const forgetPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.NOT_FOUND, "User not found");
    }
    if (!user.auths.find((auth) => auth.provider === user_interface_1.AuthProvider.CREDENTIALS) ||
        !user.password) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.UNAUTHORIZED, "User is not authenticated with credentials.");
    }
    if (user.isBlocked) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.UNAUTHORIZED, "User is blocked.");
    }
    if (user.isDeleted) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.UNAUTHORIZED, "User is deleted.");
    }
    if (!user.isVerified) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.UNAUTHORIZED, "User is not verified.");
    }
    const jwtPayload = {
        userId: user._id.toString(),
        role: user.role,
        email: user.email,
    };
    const token = (0, jwt_1.generateJwt)(jwtPayload, env_1.envVars.JWT_RESET_PASSWORD_TOKEN_SECRET, env_1.envVars.JWT_RESET_PASSWORD_TOKEN_EXPIRES_IN);
    const resetPasswordLink = `${env_1.envVars.CLIENT_URL}/reset-password?token=${token}&id=${user._id.toString()}`;
    const expiredTime = env_1.envVars.JWT_RESET_PASSWORD_TOKEN_EXPIRES_IN;
    yield (0, sendEmail_1.sendEmail)({
        to: user.email,
        subject: "Reset Password",
        templateName: "forgetPassword",
        templateData: {
            name: user.name,
            email: user.email,
            resetUrlLink: resetPasswordLink,
            appName: env_1.envVars.APP_NAME,
            expiredTime: (0, formatTime_1.formatTimeString)(expiredTime),
        },
    });
    return token;
});
// ✅
const resetPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(payload.id).select("password auths email");
    if (!user) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.NOT_FOUND, "User not found");
    }
    const decoded = (0, jwt_1.verifyJwt)(payload.token, env_1.envVars.JWT_RESET_PASSWORD_TOKEN_SECRET);
    if (!decoded) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "Your session is expired");
    }
    if (decoded.userId !== user._id.toString()) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.UNAUTHORIZED, "You are not authorized to access this route.");
    }
    if (!user.auths.find((auth) => auth.provider === user_interface_1.AuthProvider.CREDENTIALS) ||
        !user.password) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.UNAUTHORIZED, "User is not authenticated with credentials.");
    }
    user.password = payload.newPassword;
    yield user.save({ validateBeforeSave: true });
    return { email: user.email };
});
const setPassword = (userId, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(userId).select("password auths email");
    if (!user) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.NOT_FOUND, "User not found");
    }
    if (user.auths.find((auth) => auth.provider === user_interface_1.AuthProvider.CREDENTIALS) ||
        user.password) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "User is already authenticated with credentials.");
    }
    user.password = newPassword;
    user.auths.push({
        provider: user_interface_1.AuthProvider.CREDENTIALS,
        providerId: user.email,
    });
    yield user.save();
    return true;
});
const refreshTokens = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = (0, jwt_1.verifyJwt)(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);
    if (!decoded) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.UNAUTHORIZED, "You are not logged in.");
    }
    const user = yield user_model_1.default.findById(decoded.userId).select("-password");
    if (!user) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.NOT_FOUND, "User not found.");
    }
    const newAccessToken = (0, jwt_1.generateJwt)({ userId: user._id.toString(), email: user.email, role: user.role }, process.env.JWT_ACCESS_TOKEN_SECRET, process.env.JWT_ACCESS_TOKEN_EXPIRES_IN);
    const newRefreshTokenToken = (0, jwt_1.generateJwt)({ userId: user._id.toString(), email: user.email, role: user.role }, process.env.JWT_REFRESH_TOKEN_SECRET, process.env.JWT_REFRESH_TOKEN_EXPIRES_IN);
    user.lastLogin = new Date();
    yield user.save();
    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshTokenToken,
        user,
    };
});
const me = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(userId).select("-password");
    if (!user) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.NOT_FOUND, "User not found.");
    }
    return user;
});
exports.AuthService = {
    changePassword,
    resetPassword,
    forgetPassword,
    setPassword,
    refreshTokens,
    me,
};
