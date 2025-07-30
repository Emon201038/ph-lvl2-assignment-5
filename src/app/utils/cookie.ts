import { CookieOptions, Response } from "express";

export const setCookie = (res: Response, name: string, value: string, options: CookieOptions) => res.cookie(name, value, { ...options, httpOnly: true });

export interface IAuthCookies {
  accessToken?: string;
  refreshToken?: string;
}
export const setAuthCookies = (res: Response, token: IAuthCookies) => {
  if (token.accessToken)
    setCookie(res, "accessToken", token.accessToken, { httpOnly: true, secure: false, sameSite: "lax" });

  if (token.refreshToken)
    setCookie(res, "refreshToken", token.refreshToken, { httpOnly: true, secure: false, sameSite: "lax" });
};

export const clearAuthCookies = (res: Response) => {
  setCookie(res, "accessToken", "", { httpOnly: true, secure: false, sameSite: "lax", maxAge: 0 });
  setCookie(res, "refreshToken", "", { httpOnly: true, secure: false, sameSite: "lax", maxAge: 0 });
};