import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js"
import userRoutes from "../modules/user/user.routes.js"
import financeRoutes from "../modules/finance/finance.routes.js"
import dashboardRoutes from "../modules/dashboard/dashboard.routes.js"
import accountRoutes from "../modules/user/account.routes.js"

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy"
  })
})

router.use("/auth", authRoutes)
router.use("/users", userRoutes)
router.use("/records", financeRoutes)
router.use("/dashboard", dashboardRoutes)
router.use("/account", accountRoutes)

export default router;