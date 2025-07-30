import z from "zod";

export const loginSchema = z.object({
  email: z.string().email("User email is invalid"),
  password: z.string().min(6, "Password must be at least 6 characters").max(32, "Password must be at most 32 characters")
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(6, "Password must be at least 6 characters").max(32, "Password must be at most 32 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters")
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
export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters")
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
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ID format" }),
  token: z.string().regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/, { message: "Invalid token format" }),
});

export const forgetPasswordSchema = z.object({
  email: z.string().email("User email is invalid")
})
