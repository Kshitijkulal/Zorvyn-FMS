import { z } from "zod"
import { isValidDateString, isFutureDate } from "../../utils/date.js"

export const createRecordSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().min(1),
  note: z.string().optional(),
  date: z.string()
}).strict()
.refine((data) => isValidDateString(data.date), {
  message: "Invalid date format (expected YYYY-MM-DD)",
  path: ["date"]
})
.refine((data) => !isFutureDate(data.date), {
  message: "Future dates are not allowed",
  path: ["date"]
})

export const updateRecordSchema = z.object({
  amount: z.number().positive().optional(),
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  category: z.string().min(1).optional(),
  note: z.string().optional(),
  date: z.string().optional()
}).strict()
.refine((data) => {
  if (data.date && !isValidDateString(data.date)) return false
  return true
}, {
  message: "Invalid date format (expected YYYY-MM-DD)",
  path: ["date"]
})
.refine((data) => {
  if (data.date && isFutureDate(data.date)) return false
  return true
}, {
  message: "Future dates are not allowed",
  path: ["date"]
})

export const querySchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  category: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional()
}).strict()

.refine((data) => {
  if (data.startDate && !isValidDateString(data.startDate)) return false
  if (data.endDate && !isValidDateString(data.endDate)) return false
  return true
}, {
  message: "Invalid date format (expected YYYY-MM-DD)"
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