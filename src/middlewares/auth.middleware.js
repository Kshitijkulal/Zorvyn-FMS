import jwt from "jsonwebtoken"
import { env } from "../config/env.js"
import redis from "../config/redis.js"
import { AppError } from "../utils/AppError.js"

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Unauthorized", 401)
    }

    const token = authHeader.split(" ")[1]

    // Check blacklist FIRST
    const isBlacklisted = await redis.get(`blacklist:${token}`)
    if (isBlacklisted) {
      throw new AppError("Token is invalid or expired", 401)
    }

    // Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET)

    req.user = decoded

    next()
  } catch (err) {
    next(err)
  }
}