import prisma from "../../prisma/client.js"


// FILTER BUILDER

const buildWhereClause = ({ startDate, endDate, type }) => {
  const where = { isDeleted: false }

  if (type) where.type = type

  if (startDate || endDate) {
    where.date = {}

    if (startDate) {
      where.date.gte = new Date(startDate)
    }

    if (endDate) {
      // include full day (important)
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
      where.date.lte = end
    }
  }

  return where
}


//  CORE FETCH


const getFilteredRecords = async (query) => {
  const where = buildWhereClause(query)

  return prisma.record.findMany({
    where,
    orderBy: { date: "desc" }
  })
}


//  SUMMARY


export const getSummary = async (query = {}) => {
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


//  CATEGORIES


export const getCategories = async (query = {}) => {
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


//  RECENT


export const getRecent = async (query = {}) => {
  const limit = query.limit ?? 5

  return prisma.record.findMany({
    where: { isDeleted: false },
    orderBy: { date: "desc" },
    take: limit
  })
}


//  ISO WEEK HELPER


const getISOWeek = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)

  return {
    year: d.getUTCFullYear(),
    week: weekNo
  }
}


//  TRENDS


export const getTrends = async (query = {}) => {
  const interval = query.interval ?? "monthly" // ✅ ONLY place default exists

  const records = await getFilteredRecords(query)

  const bucket = {}

  for (const r of records) {
    const d = new Date(r.date)

    let key

    if (interval === "weekly") {
      const { year, week } = getISOWeek(d)
      key = `${year}-W${String(week).padStart(2, "0")}`
    } else {
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    }

    if (!bucket[key]) {
      bucket[key] = { income: 0, expense: 0 }
    }

    if (r.type === "INCOME") bucket[key].income += r.amount
    else bucket[key].expense += r.amount
  }

  return Object.entries(bucket)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([period, values]) => ({
      period,
      income: values.income,
      expense: values.expense
    }))
}


//  OVERVIEW


export const getOverview = async (query = {}) => {
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