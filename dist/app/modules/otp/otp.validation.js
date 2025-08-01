"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtpSchema = exports.sendOtpSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.sendOtpSchema = zod_1.default.object({
    email: zod_1.default.string().email("User email is invalid"),
});
exports.verifyOtpSchema = zod_1.default.object({
    email: zod_1.default.string().email("User email is invalid"),
    otp: zod_1.default
        .string()
        .min(6, "OTP must be at least 6 characters")
        .max(6, "OTP must be at most 6 characters"),
});
