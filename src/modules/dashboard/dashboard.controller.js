import * as dashboardService from "./dashboard.service.js"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { sendResponse } from "../../utils/apiResponse.js"

export const getSummary = asyncHandler(async (req, res) => {
  const data = await dashboardService.getSummary(req.validatedQuery)
  sendResponse(res, 200, "Summary fetched", data)
})

export const getCategories = asyncHandler(async (req, res) => {
  const data = await dashboardService.getCategories(req.validatedQuery)
  sendResponse(res, 200, "Categories fetched", data)
})

export const getRecent = asyncHandler(async (req, res) => {
  const data = await dashboardService.getRecent(req.validatedQuery)
  sendResponse(res, 200, "Recent records fetched", data)
})

export const getTrends = asyncHandler(async (req, res) => {
  const data = await dashboardService.getTrends(req.validatedQuery)
  sendResponse(res, 200, "Trends fetched", data)
})

export const getOverview = asyncHandler(async (req, res) => {
  const data = await dashboardService.getOverview(req.validatedQuery)
  sendResponse(res, 200, "Dashboard overview fetched", data)
})