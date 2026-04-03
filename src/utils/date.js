// src/utils/date.js

export const isValidDateString = (dateStr) => {
  const date = new Date(dateStr)

  if (isNaN(date.getTime())) return false

  const [y, m, d] = dateStr.split("-").map(Number)

  return (
    date.getUTCFullYear() === y &&
    date.getUTCMonth() + 1 === m &&
    date.getUTCDate() === d
  )
}

export const isFutureDate = (dateStr) => {
  const date = new Date(dateStr)
  return date > new Date()
}