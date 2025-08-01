"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgetPasswordSchema = exports.resetPasswordSchema = exports.changePasswordSchema = exports.loginSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.loginSchema = zod_1.default.object({
    email: zod_1.default.string().email("User email is invalid"),
    password: zod_1.default.string().min(6, "Password must be at least 6 characters").max(32, "Password must be at most 32 characters")
});
exports.changePasswordSchema = zod_1.default.object({
    oldPassword: zod_1.default.string().min(6, "Password must be at least 6 characters").max(32, "Password must be at most 32 characters"),
    newPassword: zod_1.default.string().min(6, "Password must be at least 6 characters")
        .max(32, "Password must be at most 32 characters")
        .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least one uppercase letter"
    })
        .regex(/^(?=.*[a-z])/, {
        message: "Password must contain at least one lowercase letter"
    })
        .regex(/^(?=.*[0-9])/, {
        message: "Password must contain at least one number"
    })
        .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least one special character"
    })
});
exports.resetPasswordSchema = zod_1.default.object({
    newPassword: zod_1.default.string().min(6, "Password must be at least 6 characters")
        .max(32, "Password must be at most 32 characters")
        .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least one uppercase letter"
    })
        .regex(/^(?=.*[a-z])/, {
        message: "Password must contain at least one lowercase letter"
    })
        .regex(/^(?=.*[0-9])/, {
        message: "Password must contain at least one number"
    })
        .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least one special character"
    }),
    id: zod_1.default.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ID format" }),
    token: zod_1.default.string().regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/, { message: "Invalid token format" }),
});
exports.forgetPasswordSchema = zod_1.default.object({
    email: zod_1.default.string().email("User email is invalid")
});
