"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAuthCookies = exports.setAuthCookies = exports.setCookie = void 0;
const setCookie = (res, name, value, options) => res.cookie(name, value, Object.assign(Object.assign({}, options), { httpOnly: true }));
exports.setCookie = setCookie;
const setAuthCookies = (res, token) => {
    if (token.accessToken)
        (0, exports.setCookie)(res, "accessToken", token.accessToken, { httpOnly: true, secure: false, sameSite: "lax" });
    if (token.refreshToken)
        (0, exports.setCookie)(res, "refreshToken", token.refreshToken, { httpOnly: true, secure: false, sameSite: "lax" });
};
exports.setAuthCookies = setAuthCookies;
const clearAuthCookies = (res) => {
    (0, exports.setCookie)(res, "accessToken", "", { httpOnly: true, secure: false, sameSite: "lax", maxAge: 0 });
    (0, exports.setCookie)(res, "refreshToken", "", { httpOnly: true, secure: false, sameSite: "lax", maxAge: 0 });
};
exports.clearAuthCookies = clearAuthCookies;
