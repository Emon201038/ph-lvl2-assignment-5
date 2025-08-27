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
exports.AuthController = void 0;
const appError_1 = __importDefault(require("../../helpers/appError"));
const httpStatus_1 = require("../../utils/httpStatus");
const sendResponse_1 = require("../../utils/sendResponse");
const env_1 = require("../../config/env");
const passport_1 = __importDefault(require("passport"));
const jwt_1 = require("../../utils/jwt");
const cookie_1 = require("../../utils/cookie");
const catchAsync_1 = require("../../utils/catchAsync");
const auth_service_1 = require("./auth.service");
const user_model_1 = __importDefault(require("../user/user.model"));
const login = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate("local", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return next(new appError_1.default(httpStatus_1.HTTP_STATUS.BAD_REQUEST, err));
        }
        if (!user) {
            return next(new appError_1.default(httpStatus_1.HTTP_STATUS.BAD_REQUEST, info.message));
        }
        // generate tokens
        const accessToken = (0, jwt_1.generateJwt)({ userId: user._id, email: user.email, role: user.role }, env_1.envVars.JWT_ACCESS_TOKEN_SECRET, env_1.envVars.JWT_ACCESS_TOKEN_EXPIRES_IN);
        const refreshToken = (0, jwt_1.generateJwt)({ userId: user._id, email: user.email, role: user.role }, env_1.envVars.JWT_REFRESH_TOKEN_SECRET, env_1.envVars.JWT_REFRESH_TOKEN_EXPIRES_IN);
        // set cookies
        (0, cookie_1.setAuthCookies)(res, { accessToken, refreshToken });
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: httpStatus_1.HTTP_STATUS.OK,
            message: "User logged in successfully.",
            data: {
                accessToken,
                refreshToken,
                user,
            },
        });
    }))(req, res, next);
}));
const logout = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // clearAuthCookies(res);
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.HTTP_STATUS.OK,
        message: "User logged out successfully.",
        data: null,
    });
}));
const resetPassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthService.resetPassword(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.HTTP_STATUS.OK,
        message: "password reset successfully.",
        data: result,
    });
}));
const changePassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    // check if old password and new password are same
    if (oldPassword === newPassword) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "New password must be different from old password.");
    }
    yield auth_service_1.AuthService.changePassword(decodedToken, oldPassword, newPassword);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.HTTP_STATUS.OK,
        message: "password change successfully.",
        data: null,
    });
}));
const forgetPassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    yield auth_service_1.AuthService.forgetPassword(email);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.HTTP_STATUS.OK,
        message: "Password reset link sent successfully.",
        data: null,
    });
}));
const setPassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const password = req.body.password;
    yield auth_service_1.AuthService.setPassword(decodedToken.userId, password);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.HTTP_STATUS.OK,
        message: "Password set successfully.",
        data: null,
    });
}));
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.UNAUTHORIZED, "You are not logged in.");
    }
    const _a = yield auth_service_1.AuthService.refreshTokens(refreshToken), { user } = _a, newTokens = __rest(_a, ["user"]);
    (0, cookie_1.setAuthCookies)(res, newTokens);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.HTTP_STATUS.OK,
        message: "Tokens refreshed successfully.",
        data: Object.assign(Object.assign({}, newTokens), { user }),
    });
});
const googleCallback = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.UNAUTHORIZED, "User not found.");
    }
    let redirectTo = (req.query.state || "");
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1);
    }
    if (req.user) {
        const user = yield user_model_1.default.findOne({
            email: req.user.email,
        });
        if (!user) {
            throw new appError_1.default(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "User not found.");
        }
        const accessToken = yield (0, jwt_1.generateJwt)({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        }, env_1.envVars.JWT_ACCESS_TOKEN_SECRET, env_1.envVars.JWT_ACCESS_TOKEN_EXPIRES_IN);
        const refreshToken = yield (0, jwt_1.generateJwt)({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        }, env_1.envVars.JWT_REFRESH_TOKEN_SECRET, env_1.envVars.JWT_REFRESH_TOKEN_EXPIRES_IN);
        req.user = {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        };
        (0, cookie_1.setAuthCookies)(res, {
            accessToken,
            refreshToken,
        });
        user.lastLogin = new Date();
        yield user.save();
    }
    res.redirect(`${env_1.envVars.CLIENT_URL}/${redirectTo}`);
}));
const me = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: httpStatus_1.HTTP_STATUS.OK,
        message: "User fetched successfully.",
        data: yield auth_service_1.AuthService.me(req.user.userId),
    });
}));
exports.AuthController = {
    login,
    logout,
    resetPassword,
    changePassword,
    forgetPassword,
    setPassword,
    refreshToken,
    googleCallback,
    me,
};
