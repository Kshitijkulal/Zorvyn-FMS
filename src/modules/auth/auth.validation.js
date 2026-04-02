import { z } from "zod"

export const registerSchema = z.object({
  email: z.string().email().transform((val) => val.toLowerCase().trim()),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1).optional()
})

export const verifyOtpSchema = z.object({
  email: z.string().email().transform((val) => val.toLowerCase().trim()),
  otp: z.string().length(6, "OTP must be 6 digits")
})

export const loginSchema = z.object({
  email: z.string().email().transform((val) => val.toLowerCase().trim()),
  password: z.string().min(1, "Password is required")
})

export const forgotPasswordSchema = z.object({
  email: z.string().email().transform((val) => val.toLowerCase().trim())
})

export const resetPasswordSchema = z.object({
  email: z.string().email().transform((val) => val.toLowerCase().trim()),
  otp: z.string().length(6),
  newPassword: z.string().min(8)
})