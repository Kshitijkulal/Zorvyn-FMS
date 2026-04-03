import { Router } from "express"
import * as dashboardController from "./dashboard.controller.js"

import { authenticate } from "../../middlewares/auth.middleware.js"
import { checkPermission } from "../../middlewares/role.middleware.js"
import { PERMISSIONS } from "../../constants/permissions.js"
import { validate } from "../../middlewares/validate.middleware.js"
import { dashboardQuerySchema } from "./dashboard.validation.js"

const router = Router()

router.use(authenticate)

//  SUMMARY
router.get(
  "/summary",
  checkPermission(PERMISSIONS.VIEW_DASHBOARD),
  validate(dashboardQuerySchema),
  dashboardController.getSummary
)

//  CATEGORIES
router.get(
  "/categories",
  checkPermission(PERMISSIONS.VIEW_DASHBOARD),
  validate(dashboardQuerySchema),
  dashboardController.getCategories
)

//  RECENT
router.get(
  "/recent",
  checkPermission(PERMISSIONS.VIEW_DASHBOARD),
  validate(dashboardQuerySchema),
  dashboardController.getRecent
)

//  TRENDS
router.get(
  "/trends",
  checkPermission(PERMISSIONS.VIEW_DASHBOARD),
  validate(dashboardQuerySchema),
  dashboardController.getTrends
)

//  OVERVIEW
router.get(
  "/overview",
  checkPermission(PERMISSIONS.VIEW_DASHBOARD),
  validate(dashboardQuerySchema),
  dashboardController.getOverview
)

export default router