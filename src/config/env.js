import dotenv from "dotenv"
import { z } from "zod"

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  PORT: z.coerce.number().default(8080),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  JWT_SECRET: z.string().min(10, "JWT_SECRET must be at least 10 chars"),

  JWT_EXPIRES_IN: z.string().default("1d"),

  REDIS_URL: z.string().optional(),

  SMTP_HOST: z.string().min(1),
  
  SMTP_PORT: z.coerce.number().default(587),

  SMTP_USER: z.string().email(),
  
  SMTP_PASS: z.string().min(1),
  
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error("❌ Invalid environment variables:")
  console.error(parsed.error.format())
  process.exit(1)
}

export const env = parsed.data