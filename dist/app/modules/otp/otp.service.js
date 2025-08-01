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
exports.OtpService = void 0;
const env_1 = require("../../config/env");
const redis_config_1 = require("../../config/redis.config");
const appError_1 = __importDefault(require("../../helpers/appError"));
const generateOtp_1 = require("../../utils/generateOtp");
const httpStatus_1 = require("../../utils/httpStatus");
const sendEmail_1 = require("../../utils/sendEmail");
const user_model_1 = __importDefault(require("../user/user.model"));
const OTP_EXPIRATION = 2 * 60;
const sendOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const otp = (0, generateOtp_1.generateOtp)(6);
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.NOT_FOUND, "User not found");
    }
    ;
    if (user.isVerified) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "User is already verified");
    }
    ;
    const redisKey = `otp:${email}`;
    yield redis_config_1.redisClient.set(redisKey, otp, {
        expiration: {
            type: "EX",
            value: OTP_EXPIRATION
        }
    });
    yield (0, sendEmail_1.sendEmail)({
        to: email,
        subject: "OTP Verification",
        templateName: "otp",
        templateData: { otp, name: user.name, appName: env_1.envVars.APP_NAME, expiredTime: `${Math.floor(OTP_EXPIRATION / 60)} minutes` },
    });
    return true;
});
const verifyOtp = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const redisKey = `otp:${email}`;
    const redisOtp = yield redis_config_1.redisClient.get(redisKey);
    if (!redisOtp) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "Invalid OTP");
    }
    ;
    if (redisOtp !== otp) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "Invalid OTP");
    }
    ;
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.NOT_FOUND, "User not found");
    }
    ;
    if (user.isVerified) {
        throw new appError_1.default(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "User is already verified");
    }
    ;
    user.isVerified = true;
    yield user.save({ validateBeforeSave: true });
    yield redis_config_1.redisClient.del([redisKey]);
    return true;
});
exports.OtpService = { sendOtp, verifyOtp };
