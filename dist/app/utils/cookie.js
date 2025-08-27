"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAuthCookies = exports.setAuthCookies = exports.setCookie = void 0;
const env_1 = require("../config/env");
const setCookie = (res, name, value, options) => res.cookie(name, value, Object.assign(Object.assign({}, options), { httpOnly: true }));
exports.setCookie = setCookie;
const setAuthCookies = (res, token) => {
    if (token.accessToken)
        (0, exports.setCookie)(res, "accessToken", token.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
    if (token.refreshToken)
        (0, exports.setCookie)(res, "refreshToken", token.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
};
exports.setAuthCookies = setAuthCookies;
const clearAuthCookies = (res) => {
    (0, exports.setCookie)(res, "accessToken", "", {
        httpOnly: true,
        secure: env_1.envVars.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 0,
    });
    (0, exports.setCookie)(res, "refreshToken", "", {
        httpOnly: true,
        secure: env_1.envVars.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 0,
    });
};
exports.clearAuthCookies = clearAuthCookies;
