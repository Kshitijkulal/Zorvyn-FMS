import { Router } from "express"
import * as authController from "./auth.controller.js"
import {
  registerSchema,
  verifyOtpSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from "./auth.validation.js"
import { validate } from "../../middlewares/validate.middleware.js"
import { authenticate } from "../../middlewares/auth.middleware.js"
import { authLimiter } from "../../middlewares/rateLimit.middleware.js"


const router = Router()

router.post("/register", validate(registerSchema),authLimiter, authController.register)
router.post("/verify-otp", validate(verifyOtpSchema), authLimiter, authController.verifyOtp)
router.post("/login", validate(loginSchema), authLimiter, authController.login)
router.post("/forgot-password", validate(forgotPasswordSchema), authLimiter, authController.forgotPassword)
router.post("/reset-password", validate(resetPasswordSchema), authLimiter, authController.resetPassword)
router.post("/logout", authenticate, authController.logout)

export default router