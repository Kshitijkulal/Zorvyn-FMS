import { Router } from "express"
import * as userController from "./user.controller.js"

import { validate } from "../../middlewares/validate.middleware.js"
import {
  updateRoleSchema,
  updateStatusSchema,
  updateUserSchema
} from "./user.validation.js"

import { authenticate } from "../../middlewares/auth.middleware.js"
import { checkPermission } from "../../middlewares/role.middleware.js"
import { PERMISSIONS } from "../../constants/permissions.js"

const router = Router()

// All routes protected + ADMIN only
router.use(authenticate, checkPermission(PERMISSIONS.MANAGE_USERS))

// GET /users
router.get("/", userController.getUsers)

// GET /users/:id
router.get(
  "/:id",
  userController.getUserById
)

// PATCH /users/:id/role
router.patch(
  "/:id/role",
  validate(updateRoleSchema),
  userController.updateRole
)

router.patch(
  "/:id",
  authenticate,
  checkPermission(PERMISSIONS.MANAGE_USERS),
  validate(updateUserSchema),
  userController.updateUser
)

// PATCH /users/:id/status
router.patch(
  "/:id/status",
  validate(updateStatusSchema),
  userController.updateStatus
)

// Users are not permanently deleted to preserve data integrity
// and maintain historical financial records. Instead, users are
// deactivated via status updates, which aligns with common practices
// in financial systems requiring auditability. -- kshitij

export default router