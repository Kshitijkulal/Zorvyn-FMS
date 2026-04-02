import { AppError } from "../utils/AppError.js"
import { ROLE_PERMISSIONS } from "../constants/permissions.js"

// Role-based middleware
// export const authorize = (...allowedRoles) => {
//   return (req, res, next) => {
//     if (!req.user) {
//       throw new AppError("Unauthorized", 401)
//     }

//     if (!allowedRoles.includes(req.user.role)) {
//       throw new AppError("Forbidden", 403)
//     }

//     next()
//   }
// }

// Permission-based middleware (More robust and clean)
export const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401)
    }
    const userRole = req.user.role

    const permissions = ROLE_PERMISSIONS[userRole]

    if (!permissions || !permissions.includes(permission)) {
      throw new AppError("Forbidden", 403)
    }

    next()
  }
}