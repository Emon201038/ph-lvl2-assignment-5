"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthProvider = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["SENDER"] = "SENDER";
    UserRole["RECEIVER"] = "RECEIVER";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
var AuthProvider;
(function (AuthProvider) {
    AuthProvider["GOOGLE"] = "GOOGLE";
    AuthProvider["FACEBOOK"] = "FACEBOOK";
    AuthProvider["GITHUB"] = "GITHUB";
    AuthProvider["CREDENTIALS"] = "CREDENTIALS";
})(AuthProvider || (exports.AuthProvider = AuthProvider = {}));
