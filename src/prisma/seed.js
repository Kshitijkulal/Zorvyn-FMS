import bcrypt from "bcrypt"
import prisma from "./client.js"

const seed = async () => {
  console.log("Seeding started...")

  //   Clean DB (careful in real world)
  await prisma.auditLog.deleteMany()
  await prisma.record.deleteMany()
  await prisma.user.deleteMany()

  //   Create Users
  const password = await bcrypt.hash("password123", 10)

  const admin = await prisma.user.create({
    data: {
      email: "admin@test.com",
      password,
      name: "Admin User",
      role: "ADMIN"
    }
  })

  const analyst = await prisma.user.create({
    data: {
      email: "analyst@test.com",
      password,
      name: "Analyst User",
      role: "ANALYST"
    }
  })

  const viewer = await prisma.user.create({
    data: {
      email: "viewer@test.com",
      password,
      name: "Viewer User",
      role: "VIEWER"
    }
  })

  console.log("Users created")

  //   Helper for random data
  const categoriesIncome = ["Salary", "Freelance", "Investments"]
  const categoriesExpense = ["Food", "Travel", "Shopping", "Bills"]

  const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)]

  const records = []

  //   Generate 30–50 records across 3 months
  for (let i = 0; i < 40; i++) {
    const isIncome = Math.random() > 0.4

    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 90))

    records.push({
      amount: isIncome
        ? Math.floor(Math.random() * 50000) + 5000
        : Math.floor(Math.random() * 5000) + 200,

      type: isIncome ? "INCOME" : "EXPENSE",

      category: isIncome
        ? getRandom(categoriesIncome)
        : getRandom(categoriesExpense),

      notes: "Seeded data",
      date,

      createdBy: admin.id
    })
  }

  await prisma.record.createMany({
    data: records
  })

  console.log("Records created")

  console.log("Seeding completed")
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })