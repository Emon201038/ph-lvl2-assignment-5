import { envVars } from "../../config/env";
import { redisClient } from "../../config/redis.config";
import AppError from "../../helpers/appError";
import { generateOtp } from "../../utils/generateOtp";
import { HTTP_STATUS } from "../../utils/httpStatus";
import { sendEmail } from "../../utils/sendEmail";
import User from "../user/user.model";

const OTP_EXPIRATION = 2 * 60;

const sendOtp = async (email: string) => {
  const otp = generateOtp(6);

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "User not found");
  };

  if (user.isVerified) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "User is already verified");
  };

  const redisKey = `otp:${email}`;

  await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: OTP_EXPIRATION
    }
  });
  await sendEmail({
    to: email,
    subject: "OTP Verification",
    templateName: "otp",
    templateData: { otp, name: user.name, appName: envVars.APP_NAME, expiredTime: `${Math.floor(OTP_EXPIRATION / 60)} minutes` },
  });

  return true
};

const verifyOtp = async (email: string, otp: string) => {
  const redisKey = `otp:${email}`;

  const redisOtp = await redisClient.get(redisKey);
  if (!redisOtp) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "Invalid OTP");
  };

  if (redisOtp !== otp) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "Invalid OTP");
  };

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "User not found");
  };

  if (user.isVerified) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "User is already verified");
  };

  user.isVerified = true;
  await user.save({ validateBeforeSave: true });

  await redisClient.del([redisKey]);

  return true
};

export const OtpService = { sendOtp, verifyOtp };