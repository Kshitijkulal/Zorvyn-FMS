import { z } from "zod"

export const updateRoleSchema = z.object({
  role: z.enum(["VIEWER", "ANALYST", "ADMIN"])
}).strict()

export const updateStatusSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"])
}).strict()

export const updateUserSchema = z.object({
  name: z.string().min(1).optional()
}).strict()