import * as financeService from "./finance.service.js"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { sendResponse } from "../../utils/apiResponse.js"


export const createRecord = asyncHandler(async (req, res) => {
  const record = await financeService.createRecord(req.body, req.user)
  sendResponse(res, 201, "Record created", record)
})

export const getRecords = asyncHandler(async (req, res) => {
  const result = await financeService.getRecords(req.validatedQuery, req.user)
  sendResponse(res, 200, "Records fetched", result)
})

export const updateRecord = asyncHandler(async (req, res) => {
  const record = await financeService.updateRecord(
    req.params.id,
    req.body,
    req.user
  )
  sendResponse(res, 200, "Record updated", record)
})

export const deleteRecord = asyncHandler(async (req, res) => {
  const result = await financeService.deleteRecord(
    req.params.id,
    req.user
  )
  sendResponse(res, 200, result.message)
})