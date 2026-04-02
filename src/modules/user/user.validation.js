import { z } from "zod"

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
  role: z.enum(["VIEWER", "ANALYST", "ADMIN"]).optional()
}).strict()

export const updateRoleSchema = z.object({
  role: z.enum(["VIEWER", "ANALYST", "ADMIN"])
}).strict()

export const updateStatusSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"])
}).strict()

export const updateUserSchema = z.object({
  name: z.string().min(1).optional()
}).strict()

export const updateUserEmailSchema = z.object({
  email: z.string().email()
}).strict()

export const requestEmailChangeSchema = z.object({
  newEmail: z.string().email()
})

export const verifyEmailChangeSchema = z.object({
  newEmail: z.string().email(),
  otp: z.string().length(6)
})