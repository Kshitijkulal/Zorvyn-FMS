import { z } from "zod"
import { isValidDateString, isFutureDate } from "../../utils/date.js"

export const dashboardQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  limit: z.coerce.number().min(1).max(50).optional(),
  interval: z.enum(["monthly", "weekly"]).optional()
})
.strict()

.refine((data) => {
  if (data.startDate && !isValidDateString(data.startDate)) return false
  if (data.endDate && !isValidDateString(data.endDate)) return false
  return true
}, {
  message: "Invalid date format"
})

.refine((data) => {
  if (data.startDate && isFutureDate(data.startDate)) return false
  if (data.endDate && isFutureDate(data.endDate)) return false
  return true
}, {
  message: "Future dates are not allowed"
})

.refine((data) => {
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) <= new Date(data.endDate)
  }
  return true
}, {
  message: "startDate cannot be after endDate"
})