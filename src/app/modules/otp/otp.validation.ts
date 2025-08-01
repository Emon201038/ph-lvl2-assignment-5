import z from "zod";

export const sendOtpSchema = z.object({
  email: z.string().email("User email is invalid"),
});

export const verifyOtpSchema = z.object({
  email: z.string().email("User email is invalid"),
  otp: z
    .string()
    .min(6, "OTP must be at least 6 characters")
    .max(6, "OTP must be at most 6 characters"),
});
