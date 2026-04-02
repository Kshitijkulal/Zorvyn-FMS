import { sendResponse } from "../utils/apiResponse.js"

export const errorMiddleware = (err, req, res, next) => {
  console.error("Error:", err)

  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Server Error"

  sendResponse(res, statusCode, message)
}