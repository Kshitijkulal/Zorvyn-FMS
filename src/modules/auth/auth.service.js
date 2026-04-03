import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import prisma from "../../prisma/client.js"
import redis from "../../config/redis.js"
import { generateOTP } from "../../utils/otp.js"
import { sendOTPEmail } from "../../utils/mailer.js"
import { env } from "../../config/env.js"
import { AppError } from "../../utils/AppError.js"

const OTP_EXPIRY = 300 // 5 minutes

// 🔹 REGISTER (Step 1 - No DB write)
export const registerUser = async (data) => {
  const { email, password, name } = data

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) throw new AppError("User already exists", 409) // 409 Conflict

  const hashedPassword = await bcrypt.hash(password, 10)
  const otp = generateOTP()

  await redis.set(
    `register:${email}`,
    JSON.stringify({
      otp,
      email,
      password: hashedPassword,
      name
    }),
    { EX: OTP_EXPIRY }
  )

  await sendOTPEmail(email, otp)

  return { message: "OTP sent for verification" }
}

// 🔹 VERIFY OTP (Step 2 - DB write happens here)
export const verifyOtp = async (email, otp) => {
  const data = await redis.get(`register:${email}`)
  if (!data) throw new AppError("OTP expired", 400) // 400 Bad Request

  const parsed = JSON.parse(data)

  if (parsed.otp !== otp) {
    throw new AppError("Invalid OTP", 400) // 400 Bad Request invalid input
  }

  const user = await prisma.user.create({
    data: {
      email: parsed.email,
      password: parsed.password,
      name: parsed.name,
      status: "ACTIVE"
    }
  })

  await redis.del(`register:${email}`)

  return { message: "User verified and created successfully" }
}

// 🔹 LOGIN
export const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new AppError("User not found", 404) // 404 Not Found

  if (user.status !== "ACTIVE") {
    throw new AppError("Account is not active", 403) // 403 Forbidden
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) throw new AppError("Invalid credentials", 401) // 401 Unauthorized

  const token = jwt.sign(
    { userId: user.id, role: user.role, status: user.status },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  )

  return { token }
}

// 🔹 FORGOT PASSWORD
export const forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new AppError("User not found", 404) // 404 Not Found

    if (user.status !== "ACTIVE") {
    throw new AppError("Account is not active or has been suspended", 403) // 403 Forbidden
  }

  const otp = generateOTP()

  await redis.set(
    `reset:${email}`,
    JSON.stringify({ otp }),
    { EX: OTP_EXPIRY }
  )

  await sendOTPEmail(email, otp)

  return { message: "OTP sent for password reset" }
}

// 🔹 RESET PASSWORD
export const resetPassword = async (email, otp, newPassword) => {
  const data = await redis.get(`reset:${email}`)
  if (!data) throw new AppError("Invalid or expired OTP", 400) // 400 Bad Request
  const parsed = JSON.parse(data)

  if (parsed.otp !== otp) {
    throw new AppError("Invalid OTP", 400) // 400 Bad Request invalid input
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword }
  })

  await redis.del(`reset:${email}`)

  return { message: "Password reset successful" }
} 

export const logoutUser = async (token) => {
  const decoded = jwt.decode(token)

  if (!decoded || !decoded.exp) {
    throw new AppError("Invalid token", 401)
  }

  const currentTime = Math.floor(Date.now() / 1000)
  const ttl = decoded.exp - currentTime

  if (ttl <= 0) {
    return { message: "Token already expired" }
  }

  await redis.set(`blacklist:${token}`, "true", {
    EX: ttl
  })

  return { message: "Logged out successfully" }
}