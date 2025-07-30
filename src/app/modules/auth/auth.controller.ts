/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import e, { NextFunction, Request, Response } from "express";
import AppError from "../../helpers/appError";
import { HTTP_STATUS } from "../../utils/httpStatus";
import { sendResponse } from "../../utils/sendResponse";
import { envVars } from "../../config/env";
import passport from "passport";
import { generateJwt } from "../../utils/jwt";
import { clearAuthCookies, setAuthCookies } from "../../utils/cookie";
import { catchAsync } from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import { JwtPayload } from "jsonwebtoken";

const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', async (err: any, user: any, info: any) => {
    if (err) {
      return next(new AppError(HTTP_STATUS.UNAUTHORIZED, err));
    };

    if (!user) {
      return next(new AppError(HTTP_STATUS.UNAUTHORIZED, info.message));
    };

    // generate tokens
    const accessToken = generateJwt({ userId: user._id, email: user.email, role: user.role }, envVars.JWT_ACCESS_TOKEN_SECRET, envVars.JWT_ACCESS_TOKEN_EXPIRES_IN);
    const refreshToken = generateJwt({ userId: user._id, email: user.email, role: user.role }, envVars.JWT_REFRESH_TOKEN_SECRET, envVars.JWT_REFRESH_TOKEN_EXPIRES_IN);

    // set cookies
    setAuthCookies(res, { accessToken, refreshToken });

    sendResponse(res, {
      success: true,
      statusCode: HTTP_STATUS.OK,
      message: "User logged in successfully.",
      data: {
        accessToken,
        refreshToken,
      }
    })

  })(req, res, next);
});

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  clearAuthCookies(res);
  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "User logged out successfully.",
    data: null
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  await AuthService.resetPassword(req.body);

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "password reset successfully.",
    data: null
  });
});

const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const decodedToken = req.user as JwtPayload;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  // check if old password and new password are same
  if (oldPassword === newPassword) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "New password must be different from old password.");
  };

  await AuthService.changePassword(decodedToken, oldPassword, newPassword);

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "password change successfully.",
    data: null
  });
});

const forgetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const email = req.body.email;
  await AuthService.forgetPassword(email);
  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Password reset link sent successfully.",
    data: null
  });
});

const setPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const decodedToken = req.user as JwtPayload;
  const password = req.body.password;
  await AuthService.setPassword(decodedToken.userId, password);
  return
})

const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, "You are not logged in.");
  };
  const { user, ...newTokens } = await AuthService.refreshTokens(refreshToken);

  setAuthCookies(res, newTokens);
  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "Tokens refreshed successfully.",
    data: { ...newTokens, user }
  });
};

const googleCallback = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (!user) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, "User not found.");
  };

  let redirectTo = (req.query.state || "") as string;
  if (redirectTo.startsWith("/")) {
    redirectTo = redirectTo.slice(1);
  };

  res.redirect(`${envVars.CLIENT_URL}/${redirectTo}`);
});


export const AuthController = {
  login,
  logout,
  resetPassword,
  changePassword,
  forgetPassword,
  setPassword,
  refreshToken,
  googleCallback,
};