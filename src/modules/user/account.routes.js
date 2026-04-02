import { Router } from "express"
import * as userController from "./user.controller.js"

import { authenticate } from "../../middlewares/auth.middleware.js"
import { validate } from "../../middlewares/validate.middleware.js"
import {
  requestEmailChangeSchema,
  verifyEmailChangeSchema
} from "./user.validation.js"

const router = Router()

// All routes here are authenticated users (self actions)
router.use(authenticate)

// POST /account/change-email/request
router.post(
  "/change-email/request",
  validate(requestEmailChangeSchema),
  userController.requestEmailChange
)

// POST /account/change-email/verify
router.post(
  "/change-email/verify",
  validate(verifyEmailChangeSchema),
  userController.verifyEmailChange
)

export default router