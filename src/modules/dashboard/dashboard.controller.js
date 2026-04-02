import * as dashboardService from "./dashboard.service.js"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { sendResponse } from "../../utils/apiResponse.js"

// Normalize query defaults (single source of truth)
const normalizeQuery = (query) => ({
  limit: 5,
  interval: "monthly",
  ...query
})

export const getSummary = asyncHandler(async (req, res) => {
  const query = normalizeQuery(req.validatedQuery)

  const data = await dashboardService.getSummary(query)
  sendResponse(res, 200, "Summary fetched", data)
})

export const getCategories = asyncHandler(async (req, res) => {
  const query = normalizeQuery(req.validatedQuery)

  const data = await dashboardService.getCategories(query)
  sendResponse(res, 200, "Categories fetched", data)
})

export const getRecent = asyncHandler(async (req, res) => {
  const query = normalizeQuery(req.validatedQuery)

  const data = await dashboardService.getRecent(query)
  sendResponse(res, 200, "Recent records fetched", data)
})

export const getTrends = asyncHandler(async (req, res) => {
  const query = normalizeQuery(req.validatedQuery)

  const data = await dashboardService.getTrends(query)
  sendResponse(res, 200, "Trends fetched", data)
})

export const getOverview = asyncHandler(async (req, res) => {
  const query = normalizeQuery(req.validatedQuery)

  const data = await dashboardService.getOverview(query)
  sendResponse(res, 200, "Dashboard overview fetched", data)
})