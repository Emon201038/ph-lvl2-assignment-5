"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRoleSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
exports.createUserSchema = zod_1.default.object({
    name: zod_1.default
        .string({ error: "User name is required." })
        .min(3, { message: "User name must be at least 3 characters" })
        .max(32, { message: "User name must be at most 32 characters" }),
    email: zod_1.default
        .string({
        message: "User email is required.",
    })
        .email("User email is invalid"),
    password: zod_1.default
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(32, "Password must be at most 32 characters")
        .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least one uppercase letter",
    })
        .regex(/^(?=.*[a-z])/, {
        message: "Password must contain at least one lowercase letter",
    })
        .regex(/^(?=.*[0-9])/, {
        message: "Password must contain at least one number",
    })
        .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least one special character",
    }),
    adress: zod_1.default.string().optional(),
    phone: zod_1.default
        .string()
        .regex(/^(?:\+8801|01)[3-9]\d{8}$/, {
        message: "Phone number is invalid. Please enter a valid Bangladeshi phone number starting with +8801 or 01",
    })
        .optional(),
    role: zod_1.default
        .enum([user_interface_1.UserRole.SENDER, user_interface_1.UserRole.RECEIVER])
        .default(user_interface_1.UserRole.RECEIVER)
        .optional(),
});
exports.updateUserSchema = zod_1.default.object({
    name: zod_1.default
        .string()
        .min(3, "User name must be at least 3 characters")
        .max(32, "User name must be at most 32 characters")
        .optional(),
    currentPassword: zod_1.default
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(32, "Password must be at most 32 characters")
        .optional(),
    password: zod_1.default
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(32, "Password must be at most 32 characters")
        .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least one uppercase letter",
    })
        .regex(/^(?=.*[a-z])/, {
        message: "Password must contain at least one lowercase letter",
    })
        .regex(/^(?=.*[0-9])/, {
        message: "Password must contain at least one number",
    })
        .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least one special character",
    })
        .optional()
        .or(zod_1.default.literal("")),
    role: zod_1.default.enum(Object.values(user_interface_1.UserRole)).optional(),
    adress: zod_1.default
        .object({
        state: zod_1.default
            .string({ message: " state is required" })
            .optional()
            .or(zod_1.default.literal("")),
        city: zod_1.default
            .string({ message: " city is required" })
            .optional()
            .or(zod_1.default.literal("")),
        area: zod_1.default
            .string({ message: " area is required" })
            .optional()
            .or(zod_1.default.literal("")),
        adress: zod_1.default.string({ message: "Full Address is required" }).optional(),
    })
        .optional(),
    phone: zod_1.default
        .string()
        .regex(/^(?:\+8801|01)[3-9]\d{8}$/, {
        message: "Phone number is invalid. Please enter a valid Bangladeshi phone number starting with +8801 or 01",
    })
        .optional()
        .or(zod_1.default.literal("")),
    isBlocked: zod_1.default.boolean().optional(),
    isDeleted: zod_1.default.boolean().optional(),
});
exports.updateUserRoleSchema = zod_1.default.object({
    role: zod_1.default.enum(["SENDER", "RECEIVER"], "Invalid Role"),
});
