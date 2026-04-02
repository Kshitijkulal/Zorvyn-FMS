import { z } from "zod"

export const dashboardQuerySchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  limit: z.coerce.number().min(1).max(50).optional(),
  interval: z.enum(["monthly", "weekly"]).optional()
}).strict()