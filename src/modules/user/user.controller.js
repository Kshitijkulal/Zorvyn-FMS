import * as userService from "./user.service.js"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { sendResponse } from "../../utils/apiResponse.js"

// 🔹 GET USERS
export const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers()

  sendResponse(res, 200, "Users fetched successfully", users)
})

// 🔹 GET USER BY ID

export const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id)

  sendResponse(res, 200, "User fetched successfully", user)
})

// 🔹 UPDATE ROLE
export const updateRole = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { role } = req.body

  const updatedUser = await userService.updateUserRole(
    id,
    role,
    req.user.userId
  )

  sendResponse(res, 200, "User role updated successfully", updatedUser)
})

// 🔹 UPDATE STATUS
export const updateStatus = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  const updatedUser = await userService.updateUserStatus(
    id,
    status,
    req.user.userId
  )

  sendResponse(res, 200, "User status updated successfully", updatedUser)
})

// 🔹 UPDATE USER DETAIL S

export const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(
    req.params.id,
    req.body
  )

  sendResponse(res, 200, "User updated successfully", user)
})