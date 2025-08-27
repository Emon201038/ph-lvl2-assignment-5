import bcrypt from "bcryptjs";

import { JwtPayload } from "jsonwebtoken";
import User from "../user/user.model";
import AppError from "../../helpers/appError";
import { HTTP_STATUS } from "../../utils/httpStatus";
import { AuthProvider } from "../user/user.interface";
import { generateJwt, verifyJwt } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { sendEmail } from "../../utils/sendEmail";
import { formatTimeString } from "../../utils/formatTime";

// ✅
const changePassword = async (
  token: JwtPayload,
  oldPassword: string,
  newPassword: string
) => {
  const user = await User.findById(token.userId).select("password auths");
  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "User not found");
  }

  if (
    !user.auths.find((auth) => auth.provider === AuthProvider.CREDENTIALS) ||
    !user.password
  ) {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      "User is not authenticated with credentials."
    );
  }

  const currentPassword = user.password;
  const isPasswordMatch = await bcrypt.compare(
    oldPassword,
    currentPassword as string
  );

  if (!isPasswordMatch) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "Invalid old password.");
  }
  user.password = newPassword;

  await user.save();

  return true;
};

// ✅
const forgetPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "User not found");
  }

  if (
    !user.auths.find((auth) => auth.provider === AuthProvider.CREDENTIALS) ||
    !user.password
  ) {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      "User is not authenticated with credentials."
    );
  }

  if (user.isBlocked) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, "User is blocked.");
  }

  if (user.isDeleted) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, "User is deleted.");
  }

  if (!user.isVerified) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, "User is not verified.");
  }

  const jwtPayload = {
    userId: user._id.toString(),
    role: user.role,
    email: user.email,
  };

  const token = generateJwt(
    jwtPayload,
    envVars.JWT_RESET_PASSWORD_TOKEN_SECRET as string,
    envVars.JWT_RESET_PASSWORD_TOKEN_EXPIRES_IN
  );

  const resetPasswordLink = `${
    envVars.CLIENT_URL
  }/reset-password?token=${token}&id=${user._id.toString()}`;

  const expiredTime = envVars.JWT_RESET_PASSWORD_TOKEN_EXPIRES_IN;
  await sendEmail({
    to: user.email,
    subject: "Reset Password",
    templateName: "forgetPassword",
    templateData: {
      name: user.name,
      email: user.email,
      resetUrlLink: resetPasswordLink,
      appName: envVars.APP_NAME,
      expiredTime: formatTimeString(expiredTime),
    },
  });
  return token;
};

// ✅
const resetPassword = async (payload: Record<string, string>) => {
  const user = await User.findById(payload.id).select("password auths email");
  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "User not found");
  }

  const decoded = verifyJwt(
    payload.token,
    envVars.JWT_RESET_PASSWORD_TOKEN_SECRET as string
  ) as JwtPayload;
  if (!decoded) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "Your session is expired");
  }

  if (decoded.userId !== user._id.toString()) {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      "You are not authorized to access this route."
    );
  }

  if (
    !user.auths.find((auth) => auth.provider === AuthProvider.CREDENTIALS) ||
    !user.password
  ) {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      "User is not authenticated with credentials."
    );
  }

  user.password = payload.newPassword;
  await user.save({ validateBeforeSave: true });

  return { email: user.email };
};

const setPassword = async (userId: string, newPassword: string) => {
  const user = await User.findById(userId).select("password auths email");
  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "User not found");
  }

  if (
    user.auths.find((auth) => auth.provider === AuthProvider.CREDENTIALS) ||
    user.password
  ) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      "User is already authenticated with credentials."
    );
  }

  user.password = newPassword;
  user.auths.push({
    provider: AuthProvider.CREDENTIALS,
    providerId: user.email as string,
  });
  await user.save();

  return true;
};

const refreshTokens = async (refreshToken: string) => {
  const decoded = verifyJwt(
    refreshToken,
    process.env.JWT_REFRESH_TOKEN_SECRET as string
  ) as JwtPayload;
  if (!decoded) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, "You are not logged in.");
  }

  const user = await User.findById(decoded.userId).select("-password");
  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "User not found.");
  }

  const newAccessToken = generateJwt(
    { userId: user._id.toString(), email: user.email, role: user.role },
    process.env.JWT_ACCESS_TOKEN_SECRET as string,
    process.env.JWT_ACCESS_TOKEN_EXPIRES_IN
  );
  const newRefreshTokenToken = generateJwt(
    { userId: user._id.toString(), email: user.email, role: user.role },
    process.env.JWT_REFRESH_TOKEN_SECRET as string,
    process.env.JWT_REFRESH_TOKEN_EXPIRES_IN
  );

  user.lastLogin = new Date();
  await user.save();

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshTokenToken,
    user,
  };
};

const me = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "User not found.");
  }
  return user;
};

export const AuthService = {
  changePassword,
  resetPassword,
  forgetPassword,
  setPassword,
  refreshTokens,
  me,
};
