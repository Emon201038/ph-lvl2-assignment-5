import { CookieOptions, Response } from "express";
import { envVars } from "../config/env";

export const setCookie = (
  res: Response,
  name: string,
  value: string,
  options: CookieOptions
) => res.cookie(name, value, { ...options, httpOnly: true });

export interface IAuthCookies {
  accessToken?: string;
  refreshToken?: string;
}
export const setAuthCookies = (res: Response, token: IAuthCookies) => {
  if (token.accessToken)
    setCookie(res, "accessToken", token.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

  if (token.refreshToken)
    setCookie(res, "refreshToken", token.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
};

export const clearAuthCookies = (res: Response) => {
  setCookie(res, "accessToken", "", {
    httpOnly: true,
    secure: envVars.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 0,
  });
  setCookie(res, "refreshToken", "", {
    httpOnly: true,
    secure: envVars.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 0,
  });
};
