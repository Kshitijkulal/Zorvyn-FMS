import { Router } from "express"
import * as financeController from "./finance.controller.js"

import { validate } from "../../middlewares/validate.middleware.js"
import {
  createRecordSchema,
  updateRecordSchema,
  querySchema
} from "./finance.validation.js"

import { authenticate } from "../../middlewares/auth.middleware.js"
import { checkPermission } from "../../middlewares/role.middleware.js"
import { PERMISSIONS } from "../../constants/permissions.js"

const router = Router()

// 🔹 CREATE
router.post(
  "/",
  authenticate,
  checkPermission(PERMISSIONS.CREATE_RECORD),
  validate(createRecordSchema),
  financeController.createRecord
)

// 🔹 GET (FILTERED + PAGINATED)
router.get(
  "/",
  authenticate,
  checkPermission(PERMISSIONS.VIEW_RECORDS),
  validate(querySchema),
  financeController.getRecords
)

// 🔹 UPDATE
router.patch(
  "/:id",
  authenticate,
  checkPermission(PERMISSIONS.UPDATE_RECORD),
  validate(updateRecordSchema),
  financeController.updateRecord
)

// 🔹 DELETE (SOFT DELETE)
router.delete(
  "/:id",
  authenticate,
  checkPermission(PERMISSIONS.DELETE_RECORD),
  financeController.deleteRecord
)

export default router