import z from "zod";
import { UserRole } from "./user.interface";

export const createUserSchema = z.object({
  name: z
    .string({ error: "User name is required." })
    .min(3, { message: "User name must be at least 3 characters" })
    .max(32, { message: "User name must be at most 32 characters" }),
  email: z
    .string({
      message: "User email is required.",
    })
    .email("User email is invalid"),
  password: z
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
  adress: z.string().optional(),
  phone: z
    .string()
    .regex(/^(?:\+8801|01)[3-9]\d{8}$/, {
      message:
        "Phone number is invalid. Please enter a valid Bangladeshi phone number starting with +8801 or 01",
    })
    .optional(),
  role: z
    .enum([UserRole.SENDER, UserRole.RECEIVER])
    .default(UserRole.RECEIVER)
    .optional(),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(3, "User name must be at least 3 characters")
    .max(32, "User name must be at most 32 characters")
    .optional(),
  password: z
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
    .optional(),
  role: z.enum(Object.values(UserRole)).optional(),
  adress: z.string().optional(),
  phone: z
    .string()
    .regex(/^(?:\+8801|01)[3-9]\d{8}$/, {
      message:
        "Phone number is invalid. Please enter a valid Bangladeshi phone number starting with +8801 or 01",
    })
    .optional(),
  isBlocked: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
});
