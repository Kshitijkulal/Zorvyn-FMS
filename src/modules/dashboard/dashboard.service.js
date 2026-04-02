import prisma from "../../prisma/client.js"

// 🔹 Shared filter builder (pure)
const buildWhereClause = ({ startDate, endDate, type }) => {
  const where = {
    isDeleted: false
  }

  if (type) where.type = type

  if (startDate || endDate) {
    where.date = {}
    if (startDate) where.date.gte = startDate
    if (endDate) where.date.lte = endDate
  }

  return where
}

// 🔹 Core fetch
const getFilteredRecords = async (query) => {
  const where = buildWhereClause(query)

  return prisma.record.findMany({
    where,
    orderBy: { date: "desc" }
  })
}

// 🔹 SUMMARY
export const getSummary = async (query) => {
  const records = await getFilteredRecords(query)

  let totalIncome = 0
  let totalExpense = 0

  for (const r of records) {
    if (r.type === "INCOME") totalIncome += r.amount
    else totalExpense += r.amount
  }

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense
  }
}

// 🔹 CATEGORIES
export const getCategories = async (query) => {
  const records = await getFilteredRecords(query)

  const buckets = {
    INCOME: {},
    EXPENSE: {}
  }

  for (const r of records) {
    const bucket = buckets[r.type]

    if (!bucket[r.category]) bucket[r.category] = 0
    bucket[r.category] += r.amount
  }

  return {
    INCOME: Object.entries(buckets.INCOME).map(([category, total]) => ({
      category,
      total
    })),
    EXPENSE: Object.entries(buckets.EXPENSE).map(([category, total]) => ({
      category,
      total
    }))
  }
}

// 🔹 RECENT
export const getRecent = async ({ limit }) => {
  return prisma.record.findMany({
    where: { isDeleted: false },
    orderBy: { date: "desc" },
    take: limit
  })
}

// 🔹 TRENDS
export const getTrends = async ({ interval, ...query }) => {
  const records = await getFilteredRecords(query)

  const bucket = {}

  for (const r of records) {
    const d = new Date(r.date)

    let key

    if (interval === "weekly") {
      const week = Math.ceil(d.getDate() / 7)
      key = `${d.getFullYear()}-W${week}`
    } else {
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    }

    if (!bucket[key]) {
      bucket[key] = { income: 0, expense: 0 }
    }

    if (r.type === "INCOME") bucket[key].income += r.amount
    else bucket[key].expense += r.amount
  }

  return Object.entries(bucket).map(([period, values]) => ({
    period,
    income: values.income,
    expense: values.expense
  }))
}

// 🔹 OVERVIEW
export const getOverview = async (query) => {
  const [summary, categories, recent, trends] = await Promise.all([
    getSummary(query),
    getCategories(query),
    getRecent(query),
    getTrends(query)
  ])

  return {
    summary,
    categories,
    recent,
    trends
  }
}