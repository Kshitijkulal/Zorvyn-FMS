import * as authService from "./auth.service.js"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { sendResponse } from "../../utils/apiResponse.js"

export const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body)
  sendResponse(res, 201, result.message)
})

export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body
  const result = await authService.verifyOtp(email, otp)
  sendResponse(res, 200, result.message)
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const result = await authService.loginUser(email, password)
  sendResponse(res, 200, "Login successful", result)
})

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body
  const result = await authService.forgotPassword(email)
  sendResponse(res, 200, result.message)
})

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body
  const result = await authService.resetPassword(email, otp, newPassword)
  sendResponse(res, 200, result.message)
})

export const logout = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("No token provided", 401)
  }

  const token = authHeader.split(" ")[1]

  const result = await authService.logoutUser(token)

  sendResponse(res, 200, result.message)
})