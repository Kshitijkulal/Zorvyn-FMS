import prisma from "../prisma/client.js"

export const connectDB = async () => {
  try {
    await prisma.$connect()
    console.log("Database connected")
  } catch (error) {
    console.error("DB connection failed", error)
    throw error
  }
}