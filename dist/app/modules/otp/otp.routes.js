"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const otp_controller_1 = require("./otp.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const otp_validation_1 = require("./otp.validation");
const otpRoute = express_1.default.Router();
otpRoute.post("/send", (0, validateRequest_1.validateRequest)(otp_validation_1.sendOtpSchema), otp_controller_1.OtpController.sendOtp);
otpRoute.post("/verify", (0, validateRequest_1.validateRequest)(otp_validation_1.verifyOtpSchema), otp_controller_1.OtpController.verifyOtp);
exports.default = otpRoute;
