/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { HTTP_STATUS } from "../../utils/httpStatus";
import { OtpService } from "./otp.service";

const sendOtp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await OtpService.sendOtp(req.body.email);
    sendResponse(res, {
      success: true,
      statusCode: HTTP_STATUS.OK,
      message: "OTP sent successfully.",
      data: null,
    });
  }
);

const verifyOtp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await OtpService.verifyOtp(req.body.email, req.body.otp);
    sendResponse(res, {
      success: true,
      statusCode: HTTP_STATUS.OK,
      message: "OTP verified successfully.",
      data: null,
    });
  }
);

export const OtpController = { sendOtp, verifyOtp };
