import express from 'express';
import { OtpController } from './otp.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { sendOtpSchema, verifyOtpSchema } from './otp.validation';
const otpRoute = express.Router();

otpRoute.post(
  "/send",
  validateRequest(sendOtpSchema),
  OtpController.sendOtp);

otpRoute.post(
  "/verify",
  validateRequest(verifyOtpSchema),
  OtpController.verifyOtp);

export default otpRoute