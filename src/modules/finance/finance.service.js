import prisma from "../../prisma/client.js"
import { AppError } from "../../utils/AppError.js"
import { ObjectId } from "mongodb"

// 🔹 CREATE
export const createRecord = async (data, user) => {
  const { note, ...rest } = data

  return prisma.record.create({
    data: {
      ...rest,
      ...(note !== undefined && { notes: note }),
      createdBy: user.userId
    }
  })
}

// 🔹 GET (FILTER + PAGINATION + SOFT DELETE)
export const getRecords = async (query, user) => {
  const { type, category, startDate, endDate } = query

  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 10
  const skip = (page - 1) * limit

  const where = {
    isDeleted: false
  }

  if (type) where.type = type
  if (category) where.category = category

  if (startDate || endDate) {
    where.date = {}
    if (startDate) where.date.gte = startDate
    if (endDate) where.date.lte = endDate
  }

  const [records, total] = await Promise.all([
    prisma.record.findMany({
      where,
      skip,
      take: limit,
      orderBy: { date: "desc" }
    }),
    prisma.record.count({ where })
  ])

  return {
    records,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }
}

// 🔹 UPDATE (WITH SOFT DELETE CHECK)
export const updateRecord = async (id, data) => {
  if (!ObjectId.isValid(id)) {
    throw new AppError("Invalid record ID", 400);
  }

  const record = await prisma.record.findUnique({ where: { id } });

  if (!record || record.isDeleted) {
    throw new AppError("Record not found", 404)
  }

  const { note, ...rest } = data

  return prisma.record.update({
    where: { id },
    data: {
      ...rest,
      ...(note !== undefined && { notes: note })
    }
  })
}

// 🔹 DELETE → SOFT DELETE
export const deleteRecord = async (id) => {
    if (!ObjectId.isValid(id)) {
    throw new AppError("Invalid record ID", 400);
}
  const record = await prisma.record.findUnique({ where: { id } })

  if (!record || record.isDeleted) {
    throw new AppError("Record not found", 404)
  }

  await prisma.record.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date()
    }
  })

  return { message: "Record deleted successfully" }
}