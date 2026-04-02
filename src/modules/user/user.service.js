import prisma from "../../prisma/client.js";
import { AppError } from "../../utils/AppError.js";
import { ObjectId } from "mongodb";
import { generateOTP } from "../../utils/otp.js";
import redisClient from "../../config/redis.js"
import { sendOTPEmail } from "../../utils//mailer.js"
import { OTP_EXPIRY } from "../../utils/otp.js"


export const createUser = async (data) => {
  const { email, password, name, role } = data

  const existing = await prisma.user.findUnique({
    where: { email }
  })

  if (existing) {
    throw new AppError("User already exists", 400)
  }

  const user = await prisma.user.create({
    data: {
      email,
      password,
      name,
      role: role || "VIEWER",
      status: "ACTIVE"
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true
    }
  })

  return user
}

// 🔹 GET ALL USERS (ADMIN)
export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return users;
};

// 🔹 GET USER BY ID (ADMIN)

export const getUserById = async (id) => {
  if (!ObjectId.isValid(id)) {
    throw new AppError("Invalid user ID", 400);
  }
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

// 🔹 UPDATE USER ROLE
export const updateUserRole = async (userId, role, currentUserId) => {
  if (!ObjectId.isValid(userId)) {
    throw new AppError("Invalid user ID", 400);
  }
  if (userId === currentUserId) {
    throw new AppError("You cannot change your own role", 403);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  return updatedUser;
};

// 🔹 UPDATE USER STATUS
export const updateUserStatus = async (userId, status, currentUserId) => {
  if (!ObjectId.isValid(userId)) {
    throw new AppError("Invalid user ID", 400);
  }
  if (userId === currentUserId) {
    throw new AppError("You cannot change your own status", 403);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status },
  });

  return updatedUser;
};

// 🔹 UPDATE USER DETAILS (NAME)

export const updateUser = async (id, data) => {
  if (!ObjectId.isValid(id)) {
    throw new AppError("Invalid user ID", 400);
  }
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return prisma.user.update({
    where: { id },
    data,
  });
};
export const updateUserEmail = async (id, data, currentUserId) => {
  if (!ObjectId.isValid(id)) {
    throw new AppError("Invalid user ID", 400)
  }

  if (id === currentUserId) {
    throw new AppError("You cannot update your own account", 403)
  }

  const user = await prisma.user.findUnique({
    where: { id }
  })

  if (!user) {
    throw new AppError("User not found", 404)
  }

  // email uniqueness check (only if email provided)
  if (data.email) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existing && existing.id !== id) {
      throw new AppError("Email already in use", 400)
    }
  }

  return prisma.user.update({
    where: { id },
    data
  })
}

export const requestEmailChange = async (user, newEmail) => {
  if (user.email === newEmail) {
    throw new AppError("New email must be different", 400)
  }

  const existing = await prisma.user.findUnique({
    where: { email: newEmail }
  })

  if (existing) {
    throw new AppError("Email already in use", 400)
  }

  const otp = generateOTP()
  const key = `email-change:${user.userId}:${newEmail}`

  await redisClient.set(key, otp, { EX: OTP_EXPIRY })

  await sendOTPEmail(newEmail, otp)
}
export const verifyEmailChange = async (user, newEmail, otp) => {
  const key = `email-change:${user.userId}:${newEmail}`

  const storedOtp = await redisClient.get(key)

  if (!storedOtp) {
    throw new AppError("OTP expired or invalid", 400)
  }

  if (storedOtp !== otp) {
    throw new AppError("Invalid OTP", 400)
  }

  await prisma.user.update({
    where: { id: user.userId },
    data: { email: newEmail }
  })

  await redisClient.del(key)
}