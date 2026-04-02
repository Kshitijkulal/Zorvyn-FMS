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


const router = Router()

router.post("/register", validate(registerSchema), authController.register)
router.post("/verify-otp", validate(verifyOtpSchema), authController.verifyOtp)
router.post("/login", validate(loginSchema), authController.login)
router.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword)
router.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword)
router.post("/logout", authenticate, authController.logout)

export default router